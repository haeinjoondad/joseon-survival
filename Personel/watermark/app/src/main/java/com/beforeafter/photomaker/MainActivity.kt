package com.beforeafter.photomaker

import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.google.android.gms.ads.MobileAds
import com.beforeafter.photomaker.ui.editor.EditorScreen
import com.beforeafter.photomaker.ui.home.HomeScreen
import com.beforeafter.photomaker.ui.theme.BeforeAfterTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        MobileAds.initialize(this)
        setContent {
            BeforeAfterTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    NavHost(navController = navController, startDestination = "home") {
                        composable("home") {
                            HomeScreen(
                                onContinue = { beforeUri, afterUri ->
                                    val b = Uri.encode(beforeUri.toString())
                                    val a = Uri.encode(afterUri.toString())
                                    navController.navigate("editor/$b/$a")
                                }
                            )
                        }
                        composable("editor/{beforeUri}/{afterUri}") { back ->
                            val beforeUri = Uri.parse(back.arguments?.getString("beforeUri") ?: return@composable)
                            val afterUri = Uri.parse(back.arguments?.getString("afterUri") ?: return@composable)
                            EditorScreen(
                                beforeUri = beforeUri,
                                afterUri = afterUri,
                                onBack = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }
}
