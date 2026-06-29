package com.beforeafter.photomaker.ui.editor

import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.foundation.background
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.play.core.review.ReviewManagerFactory
import com.beforeafter.photomaker.analytics.AnalyticsHelper
import com.beforeafter.photomaker.util.AdIds
import com.beforeafter.photomaker.util.AdManager
import com.beforeafter.photomaker.util.BitmapUtils
import com.beforeafter.photomaker.util.MediaStoreUtils
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditorScreen(
    beforeUri: Uri,
    afterUri: Uri,
    onBack: () -> Unit,
    vm: EditorViewModel = viewModel()
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val state by vm.state.collectAsState()
    val adManager = remember { AdManager(context, AdIds.INTERSTITIAL) }
    val analytics = remember { AnalyticsHelper(context) }

    LaunchedEffect(beforeUri, afterUri) {
        vm.loadSettings(beforeUri, afterUri)
        analytics.log("editor_opened")
        adManager.load()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        bottomBar = {
            AndroidView(
                factory = { ctx ->
                    AdView(ctx).apply {
                        setAdSize(AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(ctx, 320))
                        adUnitId = AdIds.BANNER
                        loadAd(AdRequest.Builder().build())
                    }
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // 미리보기 — 스크롤 영역 밖에 고정
            BeforeAfterPreview(
                beforeUri = beforeUri,
                afterUri = afterUri,
                stacked = state.ratio.stacked,
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            )

            // 컨트롤 영역 — 키보드 올라와도 스크롤 가능
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .imePadding()
                    .padding(horizontal = 16.dp)
                    .padding(top = 12.dp, bottom = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {

            // 비율 선택
            Text("Ratio", style = MaterialTheme.typography.labelMedium)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutputRatio.entries.forEach { ratio ->
                    FilterChip(
                        selected = state.ratio == ratio,
                        onClick = {
                            vm.onRatioChange(ratio)
                            analytics.log("ratio_changed")
                        },
                        label = { Text(ratio.label) }
                    )
                }
            }

            // 라벨 토글
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    "Show Labels",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.weight(1f)
                )
                Switch(
                    checked = state.showLabels,
                    onCheckedChange = {
                        vm.onLabelsToggle(it)
                        analytics.log("labels_toggled")
                    }
                )
            }

            // 워터마크 입력
            OutlinedTextField(
                value = state.watermarkText,
                onValueChange = {
                    vm.onWatermarkTextChange(it)
                    analytics.log("watermark_changed")
                },
                label = { Text("Watermark (optional)") },
                placeholder = { Text("@myshop") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            if (state.watermarkText.isNotBlank()) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        "Show watermark",
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.weight(1f)
                    )
                    Switch(
                        checked = state.showWatermark,
                        onCheckedChange = {
                            vm.onWatermarkToggle(it)
                            analytics.log("watermark_changed")
                        }
                    )
                }
            }

            // 저장 버튼
            Button(
                onClick = {
                    analytics.log("save_clicked")
                    vm.onSaveStart()
                    vm.saveSettings()
                    // 저장 먼저 → 성공 후 광고 (정책 준수)
                    scope.launch {
                        val result = runCatching {
                            val bitmap = BitmapUtils.compose(context, state)
                            MediaStoreUtils.save(context, bitmap)
                        }

                        if (result.isFailure) {
                            vm.onSaveError()
                            analytics.log("save_failed")
                            Toast.makeText(context, "Save failed. Please try again.", Toast.LENGTH_SHORT).show()
                            return@launch
                        }

                        vm.onSaveComplete()
                        analytics.log("save_success")
                        Toast.makeText(context, "Saved to Photos", Toast.LENGTH_SHORT).show()
                        val saveCount = vm.incrementSaveCount()

                        // 저장 성공 후 전면광고
                        var adWasShown = false
                        adManager.show(
                            activity = context as android.app.Activity,
                            onShown = {
                                adWasShown = true
                                analytics.log("interstitial_shown")
                            },
                            onFailed = { analytics.log("interstitial_failed") }
                        )

                        // In-App Review: 5번째 저장, 광고 미노출, 리뷰 미요청 회차에만
                        if (saveCount >= 5 && !adWasShown && !vm.isReviewRequested()) {
                            vm.markReviewRequested()
                            analytics.log("review_requested")
                            val manager = ReviewManagerFactory.create(context)
                            manager.requestReviewFlow().addOnSuccessListener { reviewInfo ->
                                val activity = context as? android.app.Activity ?: return@addOnSuccessListener
                                manager.launchReviewFlow(activity, reviewInfo)
                            }
                        }
                    }
                },
                enabled = !state.isSaving,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
            ) {
                if (state.isSaving) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                } else {
                    Text("Save Photo", style = MaterialTheme.typography.titleMedium)
                }
            }

            Spacer(Modifier.height(4.dp))
            } // 컨트롤 Column 끝
        }
    }
}

@Composable
private fun BeforeAfterPreview(
    beforeUri: Uri,
    afterUri: Uri,
    stacked: Boolean,
    modifier: Modifier = Modifier
) {
    if (stacked) {
        Column(modifier = modifier) {
            PreviewPanel(uri = beforeUri, label = "BEFORE", modifier = Modifier.weight(1f).fillMaxWidth())
            HorizontalDivider(thickness = 2.dp)
            PreviewPanel(uri = afterUri, label = "AFTER", modifier = Modifier.weight(1f).fillMaxWidth())
        }
    } else {
        Row(modifier = modifier) {
            PreviewPanel(uri = beforeUri, label = "BEFORE", modifier = Modifier.weight(1f).fillMaxHeight())
            VerticalDivider(thickness = 2.dp)
            PreviewPanel(uri = afterUri, label = "AFTER", modifier = Modifier.weight(1f).fillMaxHeight())
        }
    }
}

@Composable
private fun PreviewPanel(uri: Uri, label: String, modifier: Modifier = Modifier) {
    Box(modifier = modifier) {
        AsyncImage(
            model = uri,
            contentDescription = label,
            contentScale = ContentScale.Fit,
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.surfaceVariant)
        )
        Surface(
            color = MaterialTheme.colorScheme.surface.copy(alpha = 0.75f),
            shape = MaterialTheme.shapes.extraSmall,
            modifier = Modifier.padding(6.dp)
        ) {
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
        }
    }
}
