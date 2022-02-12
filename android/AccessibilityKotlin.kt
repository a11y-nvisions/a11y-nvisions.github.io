package com.example.AccessibilityUtil
import android.content.Context
import android.os.Bundle
import android.os.Handler
import android.view.View
import android.view.ViewGroup
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityManager
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.*
import androidx.core.view.AccessibilityDelegateCompat
import androidx.core.view.ViewCompat
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat

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
                    info?.isClickable = false
                    info?.removeAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_CLICK)
                } else if (isChecked) {
                    info?.isChecked = true
                    info?.removeAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_CLICK)
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
        val accessibilityManager = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
        val isTalkBackOn = accessibilityManager.isTouchExplorationEnabled
        return isTalkBackOn
    }

    fun expandCollapseButton(view: View, isExpanded: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun performAccessibilityAction(
                host: View?,
                action: Int,
                args: Bundle?
            ): Boolean {
                if (action == AccessibilityNodeInfo.ACTION_COLLAPSE || action == AccessibilityNodeInfo.ACTION_EXPAND) {
                    view.performClick()
                }
                return super.performAccessibilityAction(host, action, args)
            }
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.className = Button::class.java.name
                if (isExpanded) {
                    info?.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_COLLAPSE)
                } else if (view.isSelected) {
                    info?.isSelected = false
                    info?.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_COLLAPSE)
                } else {
                    info?.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_EXPAND)
                }
            }
        }
    }

    fun expandCollapseRadioButton(view: View, isChecked: Boolean) {
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
                    info?.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_COLLAPSE)
                } else if (isChecked) {
                    info?.isChecked = true
                    info?.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_COLLAPSE)
                } else {
                    info?.isChecked = false
                    info?.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_EXPAND)
                }
            }
            override fun performAccessibilityAction(
                host: View?,
                action: Int,
                args: Bundle?
            ): Boolean {
                if (action == AccessibilityNodeInfo.ACTION_COLLAPSE || action == AccessibilityNodeInfo.ACTION_EXPAND) {
                    view.performClick()
                }
                return super.performAccessibilityAction(host, action, args)
            }
        }
    }

    fun sendFocusThisView(view: View) {
        Handler().postDelayed( {
            view.performAccessibilityAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS, null)
        }, 500)
    }

    fun setAsDropdown(view: View) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.className = Spinner::class.java.name
            }
        }
    }

    fun isChildAccessibilityFocused(viewGroup: ViewGroup): Boolean {
        var isFocused = false
        var view: View? = null
        for (i in 0 until viewGroup.childCount) {
            view = viewGroup.getChildAt(i)
            if (view.isAccessibilityFocused) {
                isFocused = true
                break
            }
        }
        return isFocused
    }

    fun setAsEditTextHint(view: View, hintMessage: String) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.hintText = hintMessage
            }
        }
    }

    fun setAsIgnoreSelected(view: View) {
        view.accessibilityDelegate = object :View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.isSelected = false
            }
        }
    }

    fun setTooltipText(view: View, textMessage: String) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View?,
                info: AccessibilityNodeInfo?
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info?.tooltipText = textMessage
            }
        }
    }

    fun setAsKeyboardKey(view: View) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            view.accessibilityDelegate = object : View.AccessibilityDelegate() {
                override fun onInitializeAccessibilityNodeInfo(
                    host: View?,
                    info: AccessibilityNodeInfo?
                ) {
                    super.onInitializeAccessibilityNodeInfo(host, info)
                    info?.isTextEntryKey = true
                }
            }
        }
    }

    fun setAsNone(view: View?) {
        ViewCompat.setAccessibilityDelegate(view!!, object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfoCompat
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.roleDescription = " "
            }
        })
    }

    fun announceToast(context: Context, toastMessage: String?) {
        Handler().postDelayed({
            val accessibilityManager = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
            val accessibilityEvent = AccessibilityEvent.obtain()
            accessibilityEvent.eventType = AccessibilityEvent.TYPE_ANNOUNCEMENT
            accessibilityEvent.text.add(toastMessage)
            accessibilityManager?.sendAccessibilityEvent(accessibilityEvent)
        }, 500)
    }
}

