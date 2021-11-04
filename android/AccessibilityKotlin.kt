package com.nvisions.solutionsforaccessibility.AccessibilityUtil
import android.view.View
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.CheckBox
import android.widget.RadioButton
import android.widget.ToggleButton
import androidx.core.view.AccessibilityDelegateCompat
import androidx.core.view.ViewCompat
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat

object AccessibilityKotlin {
    fun setAsRadioButton(view: View, isChecked: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.className = RadioButton::class.java.name
                info?.isCheckable = true
                if (view.isSelected || isChecked) {
                    info?.isChecked = true
                    info?.isSelected = false
                } else {
                    info?.isChecked = false
                }
            }
        }
    }

    fun setAsCheckBox(view: View, isChecked: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.className = CheckBox::class.java.name
                info?.isCheckable = true
                if (view.isSelected || isChecked) {
                    info?.isChecked = true
                    info?.isSelected = false
                } else {
                    info?.isChecked = false
                }
            }
        }
    }

    fun setAsTab(view: View, isSelected: Boolean) {
        ViewCompat.setAccessibilityDelegate(view, object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfoCompat?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.roleDescription = "tab"
                if (isSelected) {
                    info?.isSelected = true
                } else {
                    info?.isSelected = false
                }
            }
        })
    }

    fun setAsToggleButton(view: View, isChecked: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.className = ToggleButton::class.java.name
                info?.isCheckable = true
                if (view.isSelected || isChecked) {
                    info?.isChecked = true
                    info?.isSelected = false
                } else {
                    info?.isChecked = false
                }
            }
        }
    }
}

