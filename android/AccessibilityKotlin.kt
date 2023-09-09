package com.example.customaction


import android.content.Context
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityManager
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.Button
import android.widget.CheckBox
import android.widget.RadioButton
import android.widget.Spinner
import android.widget.Switch
import android.widget.TextView
import android.widget.ToggleButton
import androidx.core.view.AccessibilityDelegateCompat
import androidx.core.view.ViewCompat
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat

object AccessibilityKotlin {
    data class CustomAction(val actionId: Int, val actionName: String, val actionHandler: () -> Unit)

    fun setCustomAction(view: View, vararg actions: CustomAction) {
        ViewCompat.setAccessibilityDelegate(view, object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                for (action in actions) {
                    info.addAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat(action.actionId, action.actionName))
                }
            }

            override fun performAccessibilityAction(host: View, actionId: Int, args: Bundle?): Boolean {
                for (action in actions) {
                    if (action.actionId == actionId) {
                        action.actionHandler.invoke()
                        return true
                    }
                }
                return super.performAccessibilityAction(host, actionId, args)
            }
        })
    }

    private var touchExplorationStateChangeListener: AccessibilityManager.TouchExplorationStateChangeListener? = null

    fun isTalkBackOn(context: Context, callback: (Boolean) -> Unit) {
        val accessibilityManager = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as? AccessibilityManager

        val listener = AccessibilityManager.TouchExplorationStateChangeListener {
            callback(it)
        }
        touchExplorationStateChangeListener = listener

        accessibilityManager?.addTouchExplorationStateChangeListener(listener)
        callback(accessibilityManager?.isTouchExplorationEnabled == true)
    }

    fun removeTalkBackStateListener(context: Context) {
        touchExplorationStateChangeListener?.let {
            val accessibilityManager = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as? AccessibilityManager
            accessibilityManager?.removeTouchExplorationStateChangeListener(it)
        }
    }

    fun setContainerAsCheckbox(containerView: View, checkboxView: CheckBox, textView: TextView) {
        checkboxView.isClickable = false
        checkboxView.isFocusable = false
        containerView.contentDescription = textView.text
        containerView.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.isCheckable = true
                info.isChecked = checkboxView.isChecked
                info.className = CheckBox::class.java.name
            }
        }
    }

    fun setContainerAsSwitch(containerView: View, switchView: Switch, textView: TextView) {
        switchView.isClickable = false
        switchView.isFocusable = false
        containerView.contentDescription = textView.text
        containerView.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.isCheckable = true
                info.isChecked = switchView.isChecked
                info.className = Switch::class.java.name
            }
        }
    }

    fun viewAsRoleDescription(view: View?, roleDescriptionMessage: String?) {
        ViewCompat.setAccessibilityDelegate(view!!, object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfoCompat
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.roleDescription = roleDescriptionMessage
            }
        })
    }

    fun setAsButton(view: View) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.className = Button::class.java.name
            }
        }
    }

    fun setAsCheckBox(view: View, isChecked: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.className = CheckBox::class.java.name
                info.isCheckable = true
                if (view.isSelected) {
                    info.isChecked = true
                    info.isSelected = false
                } else if (isChecked) {
                    info.isChecked = true
                } else {
                    info.isChecked = false
                }
            }
        }
    }

    fun setAsRadioButton(view: View, isChecked: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.className = RadioButton::class.java.name
                info.isCheckable = true
                if (view.isSelected) {
                    info.isChecked = true
                    info.isSelected = false
                    info.removeAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_CLICK)
                    info.isClickable = false
                } else if (isChecked) {
                    info.isChecked = true
                    info.removeAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_CLICK)
                    info.isClickable = false
                } else {
                    info.isChecked = false
                }
            }
        }
    }

    fun setAsTab(view: View, isSelected: Boolean) {
        ViewCompat.setAccessibilityDelegate(view, object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfoCompat
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.roleDescription = "tab"
                if (view.isSelected) {
                    info.isClickable = false
                    info.removeAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_CLICK)
                } else if (isSelected) {
                    info.isSelected = true
                    info.isClickable = false
                    info.removeAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_CLICK)
                } else {
                    info.isSelected = false
                }
            }
        })
    }

    fun setAsToggleButton(view: View, isChecked: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.className = ToggleButton::class.java.name
                info.isCheckable = true
                if (view.isSelected) {
                    info.isChecked = true
                    info.isSelected = false
                } else if (isChecked) {
                    info.isChecked = true
                } else {
                    info.isChecked = false
                }
            }
        }
    }

    fun removeClickHintMsg(view: View) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.isClickable = false
                info.removeAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_CLICK)
            }
        }
    }


    fun expandCollapseButton(view: View, isExpanded: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.className = Button::class.java.name
                if (isExpanded) {
                    info.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_COLLAPSE)
                } else if (view.isSelected) {
                    info.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_COLLAPSE)
                    info.isSelected = false
                } else {
                    info.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_EXPAND)
                }
            }

            override fun performAccessibilityAction(
                host: View,
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

    fun collapseExpandRadioButton(view: View, isChecked: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.className = RadioButton::class.java.name
                info.isCheckable = true
                if (view.isSelected) {
                    info.isChecked = true
                    info.isSelected = false
                    info.addAction(AccessibilityNodeInfo.ACTION_COLLAPSE)
                } else if (isChecked) {
                    info.isChecked = true
                    info.addAction(AccessibilityNodeInfo.ACTION_COLLAPSE)
                } else {
                    info.isChecked = false
                    info.addAction(AccessibilityNodeInfo.ACTION_EXPAND)
                }
            }

            override fun performAccessibilityAction(
                host: View,
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

    fun collapseExpandCheckBox(view: View, isChecked: Boolean) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.className = CheckBox::class.java.name
                info.isCheckable = true
                if (view.isSelected) {
                    info.isChecked = true
                    info.isSelected = false
                    info.addAction(AccessibilityNodeInfo.ACTION_COLLAPSE)
                } else if (isChecked) {
                    info.isChecked = true
                    info.addAction(AccessibilityNodeInfo.ACTION_COLLAPSE)
                } else {
                    info.isChecked = false
                    info.addAction(AccessibilityNodeInfo.ACTION_EXPAND)
                }
            }

            override fun performAccessibilityAction(
                host: View,
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
        val handler = Handler(Looper.getMainLooper())
        handler.postDelayed({
            view.performAccessibilityAction(
                AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS,
                null
            )
        }, 500)
    }

    fun setAsDropdown(view: View) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.className = Spinner::class.java.name
            }
        }
    }

    fun setEditTextHint(view: View, hintMessage: String?) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.hintText = hintMessage
            }
        }
    }

    fun setAsIgnoreSelected(view: View) {
        view.accessibilityDelegate = object : View.AccessibilityDelegate() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.isSelected = false
            }
        }
    }

    fun announceToast(context: Context, toastMessage: String?) {
        Handler().postDelayed({
            val accessibilityManager =
                context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
            val accessibilityEvent = AccessibilityEvent.obtain()
            accessibilityEvent.eventType = AccessibilityEvent.TYPE_ANNOUNCEMENT
            accessibilityEvent.text.add(toastMessage)
            accessibilityManager?.sendAccessibilityEvent(accessibilityEvent)
        }, 500)
    }

    fun setAsKeyboardKey(view: View) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            view.accessibilityDelegate = object : View.AccessibilityDelegate() {
                override fun onInitializeAccessibilityNodeInfo(
                    host: View,
                    info: AccessibilityNodeInfo
                ) {
                    super.onInitializeAccessibilityNodeInfo(host, info)
                    info.isTextEntryKey = true
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
}

