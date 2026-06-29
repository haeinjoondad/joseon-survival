package com.beforeafter.photomaker.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "before_after_settings")

data class BeforeAfterSettings(
    val ratio: String = "4:5",
    val showLabels: Boolean = true,
    val watermarkText: String = "",
    val showWatermark: Boolean = false,
    val saveCount: Int = 0,
    val reviewRequested: Boolean = false
)

class SettingsRepository(private val context: Context) {

    private object Keys {
        val RATIO = stringPreferencesKey("ratio")
        val SHOW_LABELS = booleanPreferencesKey("show_labels")
        val WATERMARK_TEXT = stringPreferencesKey("watermark_text")
        val SHOW_WATERMARK = booleanPreferencesKey("show_watermark")
        val SAVE_COUNT = intPreferencesKey("save_count")
        val REVIEW_REQUESTED = booleanPreferencesKey("review_requested")
    }

    val settings: Flow<BeforeAfterSettings> = context.dataStore.data.map { prefs ->
        BeforeAfterSettings(
            ratio = prefs[Keys.RATIO] ?: "4:5",
            showLabels = prefs[Keys.SHOW_LABELS] ?: true,
            watermarkText = prefs[Keys.WATERMARK_TEXT] ?: "",
            showWatermark = prefs[Keys.SHOW_WATERMARK] ?: false,
            saveCount = prefs[Keys.SAVE_COUNT] ?: 0,
            reviewRequested = prefs[Keys.REVIEW_REQUESTED] ?: false
        )
    }

    suspend fun save(settings: BeforeAfterSettings) {
        context.dataStore.edit { prefs ->
            prefs[Keys.RATIO] = settings.ratio
            prefs[Keys.SHOW_LABELS] = settings.showLabels
            prefs[Keys.WATERMARK_TEXT] = settings.watermarkText
            prefs[Keys.SHOW_WATERMARK] = settings.showWatermark
            prefs[Keys.SAVE_COUNT] = settings.saveCount
            prefs[Keys.REVIEW_REQUESTED] = settings.reviewRequested
        }
    }

    suspend fun incrementSaveCount(): Int {
        var newCount = 0
        context.dataStore.edit { prefs ->
            newCount = (prefs[Keys.SAVE_COUNT] ?: 0) + 1
            prefs[Keys.SAVE_COUNT] = newCount
        }
        return newCount
    }

    suspend fun markReviewRequested() {
        context.dataStore.edit { prefs ->
            prefs[Keys.REVIEW_REQUESTED] = true
        }
    }
}
