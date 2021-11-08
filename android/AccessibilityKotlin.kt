package com.nvisions.solutionsforaccessibility.AccessibilityUtil
import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.view.View
import android.view.accessibility.AccessibilityManager
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.Button
import android.widget.CheckBox
import android.widget.RadioButton
import android.widget.ToggleButton
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.AccessibilityDelegateCompat
import androidx.core.view.ViewCompat
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat
import java.security.AccessControlContext

object AccessibilityKotlin {
    fun setAsButton(view: View) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.className = Button::class.java.name
            }
        }
    }

    fun setAsRadioButton(view: View, isChecked: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.className = RadioButton::class.java.name
                info?.isCheckable = true
                if (view.isSelected) {
                    info?.isChecked = true
                    info?.isSelected = false
                } else if (isChecked) {
                    info?.isChecked = true
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
                if (view.isSelected) {
                    info?.isChecked = true
                    info?.isSelected = false
                } else if (isChecked) {
                    info?.isChecked = true
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
                    info?.isClickable = false
                    info?.removeAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_CLICK)
                } else if (view.isSelected) {
                    info?.isClickable = false
                    info?.removeAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_CLICK)
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
                if (view.isSelected) {
                    info?.isChecked = true
                    info?.isSelected = false
                } else if (isChecked) {
                    info?.isChecked = true
                } else {
                    info?.isChecked = false
                }
            }
        }
    }

    fun removeClickHintMsg(view: View) {
    view.accessibilityDelegate = object : View.AccessibilityDelegate() {
        override fun onInitializeAccessibilityNodeInfo(host: View?, info: AccessibilityNodeInfo?) {
            super.onInitializeAccessibilityNodeInfo(host, info)
            info?.isClickable = false
            info?.removeAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_CLICK)
        }
    }
    }
    fun isTalkBackOn(context: Context): Boolean {
        val accessibilityManager = context.getSystemService(AppCompatActivity.ACCESSIBILITY_SERVICE) as AccessibilityManager
        val isTalkBackOn = accessibilityManager.isTouchExplorationEnabled
        return isTalkBackOn
    }

}

