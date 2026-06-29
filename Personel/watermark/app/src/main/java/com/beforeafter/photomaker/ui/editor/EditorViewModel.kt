package com.beforeafter.photomaker.ui.editor

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.beforeafter.photomaker.data.BeforeAfterSettings
import com.beforeafter.photomaker.data.SettingsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

enum class OutputRatio(
    val label: String,
    val width: Int,
    val height: Int,
    val stacked: Boolean = false,
    val footerHeightDp: Float = 52f,
    val watermarkTextSizeDp: Float = 12f
) {
    SQUARE("Square", 1080, 1080, false, footerHeightDp = 52f, watermarkTextSizeDp = 12f),
    LANDSCAPE("Landscape", 1280, 720, false, footerHeightDp = 36f, watermarkTextSizeDp = 10f),
    STORY("Story", 1080, 1920, true, footerHeightDp = 52f, watermarkTextSizeDp = 12f)
}

fun String.toOutputRatio(): OutputRatio = OutputRatio.entries.find { it.label == this } ?: OutputRatio.SQUARE

data class EditorState(
    val beforeUri: Uri? = null,
    val afterUri: Uri? = null,
    val ratio: OutputRatio = OutputRatio.SQUARE,
    val showLabels: Boolean = true,
    val watermarkText: String = "",
    val showWatermark: Boolean = false,
    val isSaving: Boolean = false
)

class EditorViewModel(application: Application) : AndroidViewModel(application) {

    private val repo = SettingsRepository(application)

    private val _state = MutableStateFlow(EditorState())
    val state: StateFlow<EditorState> = _state.asStateFlow()

    fun loadSettings(beforeUri: Uri, afterUri: Uri) {
        viewModelScope.launch {
            val settings = repo.settings.first()
            _state.update {
                it.copy(
                    beforeUri = beforeUri,
                    afterUri = afterUri,
                    ratio = settings.ratio.toOutputRatio(),
                    showLabels = settings.showLabels,
                    watermarkText = settings.watermarkText,
                    showWatermark = settings.showWatermark && settings.watermarkText.isNotBlank()
                )
            }
        }
    }

    fun onRatioChange(ratio: OutputRatio) = _state.update { it.copy(ratio = ratio) }
    fun onLabelsToggle(show: Boolean) = _state.update { it.copy(showLabels = show) }
    fun onWatermarkTextChange(text: String) {
        _state.update {
            it.copy(
                watermarkText = text.take(40),
                showWatermark = text.isNotBlank() && it.showWatermark
            )
        }
    }
    fun onWatermarkToggle(show: Boolean) = _state.update { it.copy(showWatermark = show) }

    fun onSaveStart() = _state.update { it.copy(isSaving = true) }
    fun onSaveComplete() = _state.update { it.copy(isSaving = false) }
    fun onSaveError() = _state.update { it.copy(isSaving = false) }

    fun saveSettings() {
        val s = _state.value
        viewModelScope.launch {
            repo.save(
                BeforeAfterSettings(
                    ratio = s.ratio.label,
                    showLabels = s.showLabels,
                    watermarkText = s.watermarkText,
                    showWatermark = s.showWatermark
                )
            )
        }
    }

    suspend fun incrementSaveCount(): Int = repo.incrementSaveCount()

    suspend fun isReviewRequested(): Boolean = repo.settings.first().reviewRequested

    suspend fun markReviewRequested() = repo.markReviewRequested()
}
