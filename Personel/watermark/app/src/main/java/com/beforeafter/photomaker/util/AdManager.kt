package com.beforeafter.photomaker.util

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback

object AdIds {
    // 테스트 ID — 출시 직전 release 빌드에서만 실제 ID로 교체
    const val BANNER = "ca-app-pub-3940256099942544/6300978111"
    const val INTERSTITIAL = "ca-app-pub-3940256099942544/1033173712"
}

class AdManager(private val context: Context, private val adUnitId: String) {

    private var ad: InterstitialAd? = null

    fun load() {
        InterstitialAd.load(context, adUnitId, AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(interstitialAd: InterstitialAd) { ad = interstitialAd }
                override fun onAdFailedToLoad(error: LoadAdError) { ad = null }
            })
    }

    fun show(activity: Activity, onShown: () -> Unit = {}, onFailed: () -> Unit = {}) {
        val current = ad
        if (current == null) {
            onFailed()
            load()
            return
        }

        current.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdShowedFullScreenContent() { onShown() }
            override fun onAdDismissedFullScreenContent() { ad = null; load() }
            override fun onAdFailedToShowFullScreenContent(error: AdError) { ad = null; onFailed(); load() }
        }
        current.show(activity)
    }
}
