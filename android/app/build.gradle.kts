plugins {
    id("com.android.application")
}

android {
    namespace = "com.sivumi.offline"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.sivumi.offline"
        minSdk = 26
        targetSdk = 35
        versionCode = 2
        versionName = "1.1-tracker"
    }

    buildTypes {
        debug {
            isMinifyEnabled = false
        }
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.core:core:1.17.0")
    implementation("androidx.webkit:webkit:1.14.0")
}
