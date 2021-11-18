package com.nvisions.solutionsforaccessibility.AccessibilityUtil;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.accessibility.AccessibilityManager;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.RadioButton;
import android.widget.Spinner;
import android.widget.ToggleButton;

import androidx.core.view.AccessibilityDelegateCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat;

public class AccessibilityUtil {
    public static void setAsButton(View view) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setClassName(Button.class.getName());
            }
        });
    }

    public static void setAsCheckBox(View view, boolean isChecked) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setClassName(CheckBox.class.getName());
                info.setCheckable(true);
                if (view.isSelected()) {
                    info.setChecked(true);
                    info.setSelected(false);
                } else if (isChecked) {
                    info.setChecked(true);
                } else {
                    info.setChecked(false);
                }
            }
        });
    }

    public static void setAsRadioButton(View view, boolean isChecked) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setClassName(RadioButton.class.getName());
                info.setCheckable(true);
                if (view.isSelected()) {
                    info.setChecked(true);
                    info.setSelected(false);
                } else if (isChecked) {
                    info.setChecked(true);
                } else {
                    info.setChecked(false);
                }
            }
        });
    }

    public static void setAsTab(View view, boolean isSelected) {
        ViewCompat.setAccessibilityDelegate(view, new AccessibilityDelegateCompat() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfoCompat info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setRoleDescription("tab");
                if (view.isSelected()) {
                    info.setClickable(false);
                    info.removeAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_CLICK);
                } else if (isSelected) {
                    info.setSelected(true);
                    info.setClickable(false);
                    info.removeAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_CLICK);
                } else {
                    info.setSelected(false);
                }
            }
        });
    }

    public static void setAsToggleButton(View view, boolean isChecked) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setClassName(ToggleButton.class.getName());
                info.setCheckable(true);
                if (view.isSelected()) {
                    info.setChecked(true);
                    info.setSelected(false);
                } else if (isChecked) {
                    info.setChecked(true);
                } else {
                    info.setChecked(false);
                }
            }
        });
    }

    public static void removeClickHintMsg(View view) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setClickable(false);
                info.removeAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_CLICK);
            }
        });
    }

    public static boolean isTalkBackOn(Context context) {
        AccessibilityManager accessibilityManager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);
         boolean isTalkBackOn = accessibilityManager.isTouchExplorationEnabled();
        return isTalkBackOn;
    }

    public static void expandCollapseButton(View view, boolean isExpanded) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setClassName(Button.class.getName());
                if (isExpanded) {
                    info.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_COLLAPSE);
                } else if (view.isSelected()) {
                    info.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_COLLAPSE);
                    info.setSelected(false);
                } else {
                    info.addAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_EXPAND);
                }
            }

            @Override
            public boolean performAccessibilityAction(View host, int action, Bundle args) {
                if (action == AccessibilityNodeInfo.ACTION_COLLAPSE || action == AccessibilityNodeInfo.ACTION_EXPAND) {
                view.performClick();
                }
                return super.performAccessibilityAction(host, action, args);
            }
        });
    }

    public static void collapseExpandRadioButton(View view, boolean isChecked) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
            info.setClassName(RadioButton.class.getName());
                info.setCheckable(true);
                if (view.isSelected()) {
                    info.setChecked(true);
                    info.setSelected(false);
                    info.addAction(AccessibilityNodeInfo.ACTION_COLLAPSE);
                } else if (isChecked) {
                    info.setChecked(true);
                    info.addAction(AccessibilityNodeInfo.ACTION_COLLAPSE);
                } else {
                    info.setChecked(false);
                    info.addAction(AccessibilityNodeInfo.ACTION_EXPAND);
                }
                            }

            @Override
            public boolean performAccessibilityAction(View host, int action, Bundle args) {
                if (action == AccessibilityNodeInfo.ACTION_COLLAPSE || action == AccessibilityNodeInfo.ACTION_EXPAND) {
                    view.performClick();
                }
                return super.performAccessibilityAction(host, action, args);
            }
        });
    }

    public static void sendFocusThisView(View view) {
        Handler handler = new Handler(Looper.getMainLooper());
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                view.performAccessibilityAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS, null);
            };
        }, 500);
    }

    public static void setAsDropdown(View view) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setClassName(Spinner.class.getName());
            }
        });
    }

    public static void setEditTextHint(View view, String hintMessage) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setHintText(hintMessage);
            }
        });
    }

    public static void setAsIgnoreSelected(View view) {
        view.setAccessibilityDelegate(new View.AccessibilityDelegate() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfo info) {
                super.onInitializeAccessibilityNodeInfo(host, info);
                info.setSelected(false);
            }
        });
    }
    }

