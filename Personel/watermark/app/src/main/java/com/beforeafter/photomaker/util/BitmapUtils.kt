package com.beforeafter.photomaker.util

import android.content.Context
import android.graphics.*
import android.net.Uri
import androidx.exifinterface.media.ExifInterface
import com.beforeafter.photomaker.ui.editor.EditorState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object BitmapUtils {

    private const val MAX_INPUT_SIZE = 2048
    private const val DIVIDER_WIDTH = 4
    private const val LABEL_TEXT_SIZE_DP = 14
    private const val WATERMARK_TEXT_SIZE_DP = 12f  // 기존 대비 ~20% 축소
    private const val LABEL_PADDING_DP = 12f
    private const val BG_OVERLAY_ALPHA = 150
    private const val FOOTER_HEIGHT_DP = 52f  // 구분선이 침범하지 않는 워터마크 예약 영역

    suspend fun compose(context: Context, state: EditorState): Bitmap = withContext(Dispatchers.IO) {
        val ratio = state.ratio
        val before = decodeBitmapFromUri(context, state.beforeUri!!)
        val after = decodeBitmapFromUri(context, state.afterUri!!)

        val outBitmap = Bitmap.createBitmap(ratio.width, ratio.height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(outBitmap)
        canvas.drawColor(Color.BLACK)

        val density = context.resources.displayMetrics.density
        val hasWatermark = state.showWatermark && state.watermarkText.isNotBlank()
        val footerHeight = if (hasWatermark) (ratio.footerHeightDp * density).toInt() else 0
        val photoAreaBottom = ratio.height - footerHeight

        if (ratio.stacked) {
            val halfHeight = (photoAreaBottom - DIVIDER_WIDTH) / 2
            val topRect = Rect(0, 0, ratio.width, halfHeight)
            val bottomRect = Rect(0, halfHeight + DIVIDER_WIDTH, ratio.width, photoAreaBottom)

            drawPanel(canvas, before, topRect)
            drawPanel(canvas, after, bottomRect)

            // 가로 구분선 — photoAreaBottom까지만
            canvas.drawRect(
                0f, halfHeight.toFloat(),
                ratio.width.toFloat(), (halfHeight + DIVIDER_WIDTH).toFloat(),
                Paint().apply { color = Color.WHITE }
            )

            if (state.showLabels) {
                val pad = LABEL_PADDING_DP * density
                drawLabel(canvas, "BEFORE", pad, pad, density)
                drawLabel(canvas, "AFTER", pad, halfHeight + DIVIDER_WIDTH + pad, density)
            }
        } else {
            val halfWidth = (ratio.width - DIVIDER_WIDTH) / 2
            val leftRect = Rect(0, 0, halfWidth, photoAreaBottom)
            val rightRect = Rect(halfWidth + DIVIDER_WIDTH, 0, ratio.width, photoAreaBottom)

            drawPanel(canvas, before, leftRect)
            drawPanel(canvas, after, rightRect)

            // 세로 구분선 — photoAreaBottom까지만
            canvas.drawRect(
                halfWidth.toFloat(), 0f,
                (halfWidth + DIVIDER_WIDTH).toFloat(), photoAreaBottom.toFloat(),
                Paint().apply { color = Color.WHITE }
            )

            if (state.showLabels) {
                val pad = LABEL_PADDING_DP * density
                drawLabel(canvas, "BEFORE", pad, pad, density)
                drawLabel(canvas, "AFTER", halfWidth + DIVIDER_WIDTH + pad, pad, density)
            }
        }

        if (hasWatermark) {
            drawWatermark(canvas, state.watermarkText, ratio.width, ratio.height, photoAreaBottom, density, ratio.watermarkTextSizeDp)
        }

        outBitmap
    }

    fun decodeBitmapFromUri(context: Context, uri: Uri, maxSize: Int = MAX_INPUT_SIZE): Bitmap {
        // EXIF orientation 읽기
        val orientation = context.contentResolver.openInputStream(uri)?.use { stream ->
            ExifInterface(stream).getAttributeInt(
                ExifInterface.TAG_ORIENTATION,
                ExifInterface.ORIENTATION_NORMAL
            )
        } ?: ExifInterface.ORIENTATION_NORMAL

        // 다운샘플링 계산
        val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        context.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, options) }

        options.inSampleSize = calculateInSampleSize(options.outWidth, options.outHeight, maxSize)
        options.inJustDecodeBounds = false
        options.inPreferredConfig = Bitmap.Config.ARGB_8888

        val raw = context.contentResolver.openInputStream(uri)!!.use {
            BitmapFactory.decodeStream(it, null, options)!!
        }

        return applyExifOrientation(raw, orientation)
    }

    fun applyExifOrientation(bitmap: Bitmap, orientation: Int): Bitmap {
        val matrix = Matrix()
        when (orientation) {
            ExifInterface.ORIENTATION_ROTATE_90 -> matrix.postRotate(90f)
            ExifInterface.ORIENTATION_ROTATE_180 -> matrix.postRotate(180f)
            ExifInterface.ORIENTATION_ROTATE_270 -> matrix.postRotate(270f)
            ExifInterface.ORIENTATION_FLIP_HORIZONTAL -> matrix.postScale(-1f, 1f)
            ExifInterface.ORIENTATION_FLIP_VERTICAL -> matrix.postScale(1f, -1f)
            ExifInterface.ORIENTATION_TRANSPOSE -> { matrix.postRotate(90f); matrix.postScale(-1f, 1f) }
            ExifInterface.ORIENTATION_TRANSVERSE -> { matrix.postRotate(270f); matrix.postScale(-1f, 1f) }
            else -> return bitmap  // ORIENTATION_NORMAL or undefined — no transform needed
        }
        val rotated = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
        if (rotated !== bitmap) bitmap.recycle()
        return rotated
    }

    /** 패널 = centerCrop 배경 + 어두운 오버레이 + fitCenter 원본 */
    private fun drawPanel(canvas: Canvas, src: Bitmap, dst: Rect) {
        drawCenterCrop(canvas, src, dst)
        canvas.drawRect(dst, Paint().apply { color = Color.argb(BG_OVERLAY_ALPHA, 0, 0, 0) })
        drawFitCenter(canvas, src, dst)
    }

    private fun drawFitCenter(canvas: Canvas, src: Bitmap, dst: Rect) {
        val dstW = dst.width().toFloat()
        val dstH = dst.height().toFloat()
        val srcAspect = src.width.toFloat() / src.height
        val dstAspect = dstW / dstH

        val scale = if (srcAspect > dstAspect) dstW / src.width else dstH / src.height
        val scaledW = src.width * scale
        val scaledH = src.height * scale
        val left = dst.left + (dstW - scaledW) / 2f
        val top = dst.top + (dstH - scaledH) / 2f

        canvas.drawBitmap(src, null, RectF(left, top, left + scaledW, top + scaledH), null)
    }

    private fun drawCenterCrop(canvas: Canvas, src: Bitmap, dst: Rect) {
        val dstW = dst.width().toFloat()
        val dstH = dst.height().toFloat()
        val srcAspect = src.width.toFloat() / src.height
        val dstAspect = dstW / dstH

        val srcRect = if (srcAspect > dstAspect) {
            val cropW = (src.height * dstAspect).toInt()
            val left = (src.width - cropW) / 2
            Rect(left, 0, left + cropW, src.height)
        } else {
            val cropH = (src.width / dstAspect).toInt()
            val top = (src.height - cropH) / 2
            Rect(0, top, src.width, top + cropH)
        }
        canvas.drawBitmap(src, srcRect, dst, null)
    }

    private fun drawLabel(canvas: Canvas, text: String, x: Float, y: Float, density: Float) {
        val textSize = LABEL_TEXT_SIZE_DP * density
        val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.WHITE
            this.textSize = textSize
            typeface = Typeface.DEFAULT_BOLD
        }
        val textW = textPaint.measureText(text)
        val padH = 8f * density
        val padV = 5f * density
        val radius = 6f * density

        val bgPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.argb(180, 0, 0, 0) }
        canvas.drawRoundRect(
            RectF(x, y, x + textW + padH * 2, y + textSize + padV * 2),
            radius, radius, bgPaint
        )
        canvas.drawText(text, x + padH, y + padV + textSize * 0.85f, textPaint)
    }

    private fun drawWatermark(
        canvas: Canvas, text: String,
        width: Int, height: Int, photoAreaBottom: Int, density: Float,
        textSizeDp: Float = WATERMARK_TEXT_SIZE_DP
    ) {
        val padH = 14f * density
        val padV = 7f * density
        val maxBgWidth = width * 0.85f  // 캔버스 너비의 85% 이내
        val maxTextWidth = maxBgWidth - padH * 2
        val minTextSize = 8f * density

        val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.WHITE
            textSize = textSizeDp * density
            typeface = Typeface.DEFAULT_BOLD
        }

        // 텍스트가 넘치면 글자 크기를 줄임 (최소 8dp까지)
        while (textPaint.measureText(text) > maxTextWidth && textPaint.textSize > minTextSize) {
            textPaint.textSize -= density
        }

        // 최소 크기에서도 넘치면 말줄임 처리
        val displayText = if (textPaint.measureText(text) > maxTextWidth) {
            var truncated = text
            while (truncated.isNotEmpty() && textPaint.measureText("$truncated…") > maxTextWidth) {
                truncated = truncated.dropLast(1)
            }
            "$truncated…"
        } else {
            text
        }

        val textSize = textPaint.textSize
        val textW = textPaint.measureText(displayText)
        val bgW = textW + padH * 2
        val bgH = textSize + padV * 2
        val radius = bgH / 2f

        val x = (width - bgW) / 2f
        val footerCenterY = (photoAreaBottom + height) / 2f
        val y = footerCenterY - bgH / 2f

        val bgPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.argb(140, 0, 0, 0) }
        canvas.drawRoundRect(RectF(x, y, x + bgW, y + bgH), radius, radius, bgPaint)
        canvas.drawText(displayText, x + padH, y + padV + textSize * 0.85f, textPaint)
    }

    private fun calculateInSampleSize(width: Int, height: Int, maxSize: Int = MAX_INPUT_SIZE): Int {
        var size = 1
        while (width / size > maxSize || height / size > maxSize) size *= 2
        return size
    }
}
