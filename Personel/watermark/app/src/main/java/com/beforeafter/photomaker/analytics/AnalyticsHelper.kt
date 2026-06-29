package com.beforeafter.photomaker.analytics

import android.content.Context
import android.os.Bundle
import com.google.firebase.analytics.FirebaseAnalytics

class AnalyticsHelper(context: Context) {
    private val fa = FirebaseAnalytics.getInstance(context)

    fun log(event: String, params: Bundle = Bundle()) = fa.logEvent(event, params)
}
