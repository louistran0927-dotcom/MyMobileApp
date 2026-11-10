package com.mymobileapp

import android.speech.tts.TextToSpeech
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.Locale

/**
 * Small TextToSpeech bridge so the app can read letters, words, animal sounds
 * and quiz prompts out loud. Children aged 3-5 cannot read yet, so hearing the
 * content is the primary way they learn it.
 */
class SpeechModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  private var tts: TextToSpeech? = null

  @Volatile private var ready = false

  init {
    tts = TextToSpeech(reactContext) { status ->
      val instance = tts ?: return@TextToSpeech
      if (status == TextToSpeech.SUCCESS) {
        val language = instance.setLanguage(Locale.US)
        if (language != TextToSpeech.LANG_MISSING_DATA &&
            language != TextToSpeech.LANG_NOT_SUPPORTED) {
          instance.setSpeechRate(SPEECH_RATE)
          ready = true
        }
      }
    }
  }

  override fun getName(): String = NAME

  @ReactMethod
  fun speak(text: String) {
    if (ready) {
      tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, UTTERANCE_ID)
    }
  }

  @ReactMethod
  fun stop() {
    tts?.stop()
  }

  override fun invalidate() {
    tts?.stop()
    tts?.shutdown()
    tts = null
    ready = false
    super.invalidate()
  }

  companion object {
    private const val NAME = "Speech"
    private const val SPEECH_RATE = 0.75f
    private const val UTTERANCE_ID = "kids-learning"
  }
}
