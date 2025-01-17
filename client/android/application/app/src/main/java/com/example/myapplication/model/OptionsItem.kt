package com.example.myapplication.model

import com.google.gson.annotations.SerializedName

data class OptionsItem(

    @field:SerializedName("text")
    val text: String? = null,

    @field:SerializedName("correct")
    val correct: Boolean? = null
)