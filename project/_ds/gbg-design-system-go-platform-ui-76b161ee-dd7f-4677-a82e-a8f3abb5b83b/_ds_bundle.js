/* @ds-bundle: {"format":3,"namespace":"GBGDesignSystemGoPlatformUI_76b161","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Link","sourcePath":"components/core/Link.jsx"},{"name":"StatusBadge","sourcePath":"components/core/StatusBadge.jsx"},{"name":"TextField","sourcePath":"components/core/TextField.jsx"}],"sourceHashes":{"components/core/Button.jsx":"a87a93c36a52","components/core/Chip.jsx":"24cc40b34083","components/core/IconButton.jsx":"3cf3f8c71a01","components/core/Link.jsx":"17c5fd69fcb4","components/core/StatusBadge.jsx":"777ad455fc82","components/core/TextField.jsx":"1969fddca58e","ui_kits/go-console/JourneyBuilderPage.jsx":"8f8413294eb5","ui_kits/go-console/JourneysPage.jsx":"863cd9013d07","ui_kits/go-console/LoginPage.jsx":"3613c9044208","ui_kits/go-console/Primitives.jsx":"9f37af065f42","ui_kits/go-console/SettingsPage.jsx":"9b0d6ca79f5d","ui_kits/go-console/Shell.jsx":"f40fdf1e1277"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GBGDesignSystemGoPlatformUI_76b161 = window.GBGDesignSystemGoPlatformUI_76b161 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GBG Go — Button.
 * Mirrors the MUI `MuiButton` overrides in src/theme.ts: three variants
 * (contained / outlined / text), two sizes (48 default, 32 short), flat —
 * no elevation, no ripple. Sentence-case, 600 weight. Destructive uses the
 * error colour with the contained or outlined treatment.
 *
 * Styling references the CSS custom properties from colors_and_type.css.
 */
const {
  useState: useButtonState
} = React;
function Button({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
  style,
  ...rest
}) {
  const isSmall = size === 'small';
  const isError = color === 'error';
  const [hover, setHover] = useButtonState(false);
  const base = {
    height: isSmall ? 32 : 48,
    padding: variant === 'text' ? '0 8px' : isSmall ? '0 12px' : '0 16px',
    fontFamily: 'var(--gbg-font-stack)',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: fullWidth ? '100%' : undefined,
    transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
    textTransform: 'none',
    boxShadow: 'none'
  };
  const variants = {
    contained: {
      background: isError ? 'var(--gbg-red-500)' : 'var(--gbg-hyacinth-400)',
      color: '#fff'
    },
    outlined: {
      background: '#fff',
      color: isError ? 'var(--gbg-red-500)' : 'var(--gbg-hyacinth-400)',
      borderColor: isError ? 'var(--gbg-red-500)' : 'var(--gbg-hyacinth-400)'
    },
    text: {
      background: 'transparent',
      color: 'var(--gbg-hyacinth-400)',
      border: 'none'
    }
  };

  // Disabled treatments mirror theme.ts: contained → C200 fill / C400 text;
  // outlined (and outlinedError) → white fill, C200 border, C300 text.
  const disabledStyle = disabled ? variant === 'outlined' ? {
    background: '#fff',
    color: 'var(--gbg-charcoal-300)',
    borderColor: 'var(--gbg-charcoal-200)'
  } : {
    background: 'var(--gbg-charcoal-200)',
    color: 'var(--gbg-charcoal-400)',
    borderColor: 'transparent'
  } : {};
  const hoverStyle = hover && !disabled ? variant === 'contained' ? {
    background: isError ? 'var(--gbg-red-700)' : 'var(--gbg-hyacinth-300)'
  } : {
    background: 'var(--gbg-hyacinth-50)'
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...disabledStyle,
      ...hoverStyle,
      ...style
    }
  }, rest), startIcon, children, endIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
/**
 * GBG Go — Chip (filter pill).
 * Small and pencil-like, not pill-shaped: 20px height, 4px radius, 1px C200
 * border, white fill, 12px / 500 caption. Optional 12px delete affordance in
 * C400. Used for active filters in the FilterBar.
 */
function Chip({
  label,
  onDelete,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 20,
      padding: '0 8px',
      background: '#fff',
      border: '1px solid var(--gbg-charcoal-200)',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--gbg-charcoal-500)',
      ...style
    }
  }, label, onDelete && /*#__PURE__*/React.createElement("button", {
    onClick: onDelete,
    "aria-label": `Remove ${label}`,
    style: {
      width: 12,
      height: 12,
      border: 'none',
      background: 'none',
      color: 'var(--gbg-charcoal-400)',
      cursor: 'pointer',
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-x",
    style: {
      fontSize: 12
    }
  })));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GBG Go — IconButton.
 * Square, transparent-by-default action with a C50 hover wash. 32px short or
 * 48px default. Always pass `ariaLabel` — icon-only controls need a name.
 */
const {
  useState: useIconButtonState
} = React;
function IconButton({
  onClick,
  disabled = false,
  ariaLabel,
  size = 32,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = useIconButtonState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    disabled: disabled,
    "aria-label": ariaLabel,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hover && !disabled ? 'var(--gbg-charcoal-50)' : 'transparent',
      color: disabled ? 'var(--gbg-charcoal-300)' : 'var(--gbg-charcoal-500)',
      border: 'none',
      borderRadius: 4,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 120ms ease',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Link.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GBG Go — Link.
 * Underlined by default (never underline-on-hover), 500 weight, Hyacinth
 * B400 → B300 on hover. Pass `color` to override (e.g. charcoal for the
 * primary-name column in tables, per the Figma table pattern).
 */
function Link({
  href,
  onClick,
  color,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href || '#',
    onClick: e => {
      if (onClick) {
        e.preventDefault();
        onClick(e);
      }
    },
    style: {
      color: color || 'var(--gbg-hyacinth-400)',
      textDecoration: 'underline',
      textDecorationColor: 'currentColor',
      fontWeight: 500,
      cursor: 'pointer',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Link });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Link.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusBadge.jsx
try { (() => {
/**
 * GBG Go — StatusBadge.
 * Tinted background + coloured dot + coloured bold caption. Never full-row
 * colouring. Colour is paired with a text label so it's never the sole
 * carrier of meaning. Four statuses: pass / fail / review / pending.
 */
const GBG_STATUS = {
  pass: {
    label: 'Passed',
    fg: 'var(--gbg-green-700)',
    bg: 'var(--gbg-green-100)'
  },
  fail: {
    label: 'Failed',
    fg: 'var(--gbg-red-700)',
    bg: 'var(--gbg-red-100)'
  },
  review: {
    label: 'In review',
    fg: 'var(--gbg-orange-700)',
    bg: 'var(--gbg-orange-100)'
  },
  pending: {
    label: 'Pending',
    fg: 'var(--gbg-charcoal-500)',
    bg: 'var(--gbg-charcoal-50)'
  }
};
function StatusBadge({
  status = 'pending',
  label,
  style
}) {
  const c = GBG_STATUS[status] || GBG_STATUS.pending;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '2px 8px',
      borderRadius: 2,
      background: c.bg,
      color: c.fg,
      fontSize: 12,
      fontWeight: 600,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: c.fg,
      display: 'inline-block'
    }
  }), label || c.label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/core/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GBG Go — TextField.
 * Label sits above the field (not in an outlined notch). 40px height, white
 * fill, 4px radius, 1px C300 border → C400 hover → B400 focus, red on error.
 * Mirrors the MuiOutlinedInput + MuiInputLabel overrides in src/theme.ts.
 */
const {
  useState: useTextFieldState
} = React;
function TextField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  helperText,
  error = false,
  required = false,
  disabled = false,
  style,
  ...rest
}) {
  const [focused, setFocused] = useTextFieldState(false);
  const borderColor = error ? 'var(--gbg-red-500)' : focused ? 'var(--gbg-hyacinth-400)' : 'var(--gbg-charcoal-300)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--gbg-charcoal-500)',
      marginBottom: 4
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    required: required,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: 40,
      padding: '8px 12px',
      fontFamily: 'var(--gbg-font-stack)',
      fontSize: 14,
      color: 'var(--gbg-charcoal-700)',
      background: disabled ? 'var(--gbg-charcoal-50)' : '#fff',
      border: `1px solid ${borderColor}`,
      borderRadius: 4,
      outline: 'none',
      transition: 'border-color 120ms ease'
    }
  }, rest)), helperText && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: error ? 'var(--gbg-red-700)' : 'var(--gbg-charcoal-400)',
      marginTop: 4
    }
  }, helperText));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TextField.jsx", error: String((e && e.message) || e) }); }

// ui_kits/go-console/JourneyBuilderPage.jsx
try { (() => {
/**
 * Page: Journey builder (React Flow placeholder — static canvas).
 * Matches the structure from src/pages/journey without the real react-flow library.
 */
const {
  useState: useStateJB
} = React;
function ModuleCard({
  icon,
  label,
  selected,
  tone = 'blue'
}) {
  const bg = tone === 'peach' ? 'var(--gbg-peach-100)' : 'var(--gbg-hyacinth-100)';
  const fg = tone === 'peach' ? 'var(--gbg-peach-500)' : 'var(--gbg-hyacinth-400)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      height: 56,
      padding: '0 12px',
      width: 240,
      background: '#fff',
      border: `1px solid ${selected ? 'var(--gbg-hyacinth-400)' : 'var(--gbg-charcoal-300)'}`,
      borderRadius: 8,
      boxShadow: '2px 4px 10px 0 rgba(0,0,0,.10)',
      transition: 'border-color 160ms ease'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 4,
      background: bg,
      color: fg,
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph ${icon}`,
    style: {
      fontSize: 20
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--gbg-charcoal-700)',
      fontWeight: 500
    }
  }, label));
}
function EdgePlus() {
  const [hover, setHover] = useStateJB(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      height: 28,
      display: 'grid',
      placeItems: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 2,
      height: 28,
      background: 'var(--gbg-charcoal-300)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Insert module",
    style: {
      position: 'absolute',
      width: 20,
      height: 20,
      borderRadius: 10,
      background: '#fff',
      border: '1px solid var(--gbg-hyacinth-400)',
      color: 'var(--gbg-hyacinth-400)',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      opacity: hover ? 1 : 0,
      pointerEvents: hover ? 'auto' : 'none',
      transition: 'opacity 180ms ease'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-plus",
    style: {
      fontSize: 12
    }
  })));
}
function JourneyBuilderPage({
  journeyId,
  onBack
}) {
  const [title, setTitle] = useStateJB('KYC — Retail onboarding');
  const [editing, setEditing] = useStateJB(false);
  const [selected, setSelected] = useStateJB('data');
  const [published, setPublished] = useStateJB(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      minHeight: 0,
      height: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 68,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid var(--gbg-charcoal-200)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flex: 1
    }
  }, editing ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: title,
    onChange: e => setTitle(e.target.value),
    onBlur: () => setEditing(false),
    onKeyDown: e => {
      if (e.key === 'Enter') setEditing(false);
    },
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--gbg-charcoal-700)',
      fontFamily: 'var(--gbg-font-stack)',
      border: '1px solid var(--gbg-hyacinth-400)',
      borderRadius: 4,
      padding: '2px 6px',
      outline: 'none'
    }
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--gbg-charcoal-700)'
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(true),
    "aria-label": "Rename journey",
    style: {
      width: 32,
      height: 32,
      background: 'transparent',
      border: 'none',
      color: 'var(--gbg-charcoal-500)',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-pencil-simple",
    style: {
      fontSize: 18
    }
  })))), /*#__PURE__*/React.createElement(Button, {
    size: "small",
    onClick: () => setPublished(true)
  }, "Publish to preview")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--gbg-charcoal-50)',
      backgroundImage: 'radial-gradient(var(--gbg-charcoal-200) 1px, transparent 1px)',
      backgroundSize: '16px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: 48,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(ModuleCard, {
    icon: "ph-play-circle",
    label: "Start + pre-fill",
    tone: "peach"
  }), /*#__PURE__*/React.createElement(EdgePlus, null), /*#__PURE__*/React.createElement("div", {
    onClick: () => setSelected('data')
  }, /*#__PURE__*/React.createElement(ModuleCard, {
    icon: "ph-database",
    label: "Data verification",
    selected: selected === 'data'
  })), /*#__PURE__*/React.createElement(EdgePlus, null), /*#__PURE__*/React.createElement("div", {
    onClick: () => setSelected('email')
  }, /*#__PURE__*/React.createElement(ModuleCard, {
    icon: "ph-envelope-simple",
    label: "Email (Essential)",
    selected: selected === 'email'
  })), /*#__PURE__*/React.createElement(EdgePlus, null), /*#__PURE__*/React.createElement("div", {
    onClick: () => setSelected('eval')
  }, /*#__PURE__*/React.createElement(ModuleCard, {
    icon: "ph-flow-arrow",
    label: "Evaluation",
    selected: selected === 'eval'
  })), /*#__PURE__*/React.createElement(EdgePlus, null), /*#__PURE__*/React.createElement(ModuleCard, {
    icon: "ph-stop-circle",
    label: "End of journey",
    tone: "peach"
  }))), published && /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--gbg-green-100)',
      color: 'var(--gbg-green-700)',
      border: '1px solid var(--gbg-green-100)',
      padding: '12px 16px',
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontSize: 13,
      fontWeight: 500
    }
  }, "Journey published successfully", /*#__PURE__*/React.createElement("button", {
    onClick: () => setPublished(false),
    style: {
      all: 'unset',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontWeight: 600
    }
  }, "Dismiss"))), /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 320,
      flexShrink: 0,
      background: '#fff',
      borderLeft: '1px solid var(--gbg-charcoal-200)',
      padding: 24,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 18,
      fontWeight: 800,
      color: 'var(--gbg-charcoal-700)'
    }
  }, "Browse and add modules"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 16px',
      fontSize: 14,
      color: 'var(--gbg-charcoal-400)'
    }
  }, "Search or browse by category"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-magnifying-glass",
    style: {
      position: 'absolute',
      left: 12,
      top: 12,
      fontSize: 16,
      color: 'var(--gbg-charcoal-400)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search all modules",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: 40,
      padding: '0 12px 0 36px',
      border: '1px solid var(--gbg-charcoal-300)',
      borderRadius: 4,
      fontFamily: 'var(--gbg-font-stack)',
      fontSize: 14,
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(CategoryRow, {
    icon: "ph-database",
    label: "Processing"
  }), /*#__PURE__*/React.createElement(CategoryRow, {
    icon: "ph-flow-arrow",
    label: "Routing"
  }))));
}
function CategoryRow({
  icon,
  label
}) {
  const [hover, setHover] = useStateJB(false);
  return /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      all: 'unset',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderRadius: 8,
      background: hover ? 'var(--gbg-charcoal-50)' : '#fff',
      border: '1px solid var(--gbg-charcoal-200)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph ${icon}`,
    style: {
      fontSize: 20,
      color: 'var(--gbg-charcoal-500)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--gbg-charcoal-700)'
    }
  }, label)), /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-caret-right",
    style: {
      fontSize: 14,
      color: 'var(--gbg-charcoal-400)'
    }
  }));
}
Object.assign(window, {
  JourneyBuilderPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/go-console/JourneyBuilderPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/go-console/JourneysPage.jsx
try { (() => {
/**
 * Page: Journeys list (filterable table)
 */
const {
  useState: useStateJ,
  useRef: useRefJ
} = React;
const MOCK_JOURNEYS = [{
  id: 'jny_01',
  name: 'KYC — Retail onboarding',
  publishedAt: '11 Apr 2025 11:15',
  updatedAt: '20 Apr 2025 12:05'
}, {
  id: 'jny_02',
  name: 'AML — Corporate customers',
  publishedAt: '1 Apr 2025 15:15',
  updatedAt: '1 Apr 2025 15:15'
}, {
  id: 'jny_03',
  name: 'Sanctions refresh — monthly',
  publishedAt: '1 Mar 2024 09:12',
  updatedAt: '1 Mar 2024 09:12'
}, {
  id: 'jny_04',
  name: 'Document authentication pilot',
  publishedAt: '15 Feb 2024 14:41',
  updatedAt: '28 Mar 2025 09:02'
}, {
  id: 'jny_05',
  name: 'High-risk review route',
  publishedAt: '12 Jan 2024 10:00',
  updatedAt: '14 Apr 2025 16:32'
}];
function JourneysPage({
  onOpenJourney
}) {
  const [filters, setFilters] = useStateJ([{
    id: 'name',
    label: 'Name: Journey'
  }]);
  const [sortBy, setSortBy] = useStateJ('updatedAt');
  const [sortDir, setSortDir] = useStateJ('desc');
  const [page, setPage] = useStateJ(1);
  const totalResults = 10000;
  const totalPages = 1000;
  const [createAnchor, setCreateAnchor] = useStateJ(null);
  const [rowMenu, setRowMenu] = useStateJ(null);
  const createBtnRef = useRefJ(null);
  const onSort = key => {
    if (sortBy === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');else {
      setSortBy(key);
      setSortDir('asc');
    }
  };
  const Header = ({
    k,
    label
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: () => onSort(k),
    style: {
      all: 'unset',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: sortBy === k ? 'var(--gbg-hyacinth-400)' : 'var(--gbg-charcoal-700)',
      fontWeight: 800,
      fontSize: 14
    }
  }, label, sortBy === k && /*#__PURE__*/React.createElement("i", {
    className: `ph-bold ph-caret-${sortDir === 'asc' ? 'up' : 'down'}`,
    style: {
      fontSize: 12
    }
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    heading: "Journeys",
    placement: "inline",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "small",
      onClick: e => setCreateAnchor(createAnchor ? null : e.currentTarget),
      endIcon: /*#__PURE__*/React.createElement("i", {
        className: "ph-bold ph-caret-down",
        style: {
          fontSize: 14
        }
      })
    }, "Create a new journey"), /*#__PURE__*/React.createElement(Menu, {
      open: !!createAnchor,
      anchorEl: createAnchor,
      onClose: () => setCreateAnchor(null),
      minWidth: 288
    }, /*#__PURE__*/React.createElement(MenuItem, {
      primary: "API + hosted (latest)",
      secondary: "Our latest API, with optional hosted screens",
      onClick: () => {
        setCreateAnchor(null);
        onOpenJourney?.('jny_01');
      }
    }), /*#__PURE__*/React.createElement(MenuItem, {
      primary: "API only (v1)",
      secondary: "Build your own UI using API v1",
      onClick: () => {
        setCreateAnchor(null);
        onOpenJourney?.('jny_01');
      }
    }), /*#__PURE__*/React.createElement(MenuItem, {
      primary: "Use a template",
      secondary: "Browse and pick a pre-built journey",
      onClick: () => {
        setCreateAnchor(null);
        onOpenJourney?.('jny_01');
      }
    }), /*#__PURE__*/React.createElement(MenuItem, {
      primary: "Import a journey",
      secondary: "Upload an exported Go journey",
      onClick: () => {
        setCreateAnchor(null);
        onOpenJourney?.('jny_01');
      }
    })))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--gbg-charcoal-200)',
      borderRadius: 8,
      overflow: 'hidden',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px',
      borderBottom: '1px solid var(--gbg-charcoal-200)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    variant: "outlined",
    endIcon: /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-plus",
      style: {
        fontSize: 14
      }
    })
  }, "Add filter"), filters.map(f => /*#__PURE__*/React.createElement(Chip, {
    key: f.id,
    label: f.label,
    onDelete: () => setFilters(filters.filter(x => x.id !== f.id))
  }))), filters.length > 0 && /*#__PURE__*/React.createElement(Button, {
    size: "small",
    variant: "outlined",
    onClick: () => setFilters([])
  }, "Clear all")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      fontFamily: 'var(--gbg-font-stack)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      padding: '15px 8px 15px 24px',
      borderBottom: '1px solid var(--gbg-charcoal-200)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    k: "name",
    label: "Name"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      padding: '15px 8px',
      borderBottom: '1px solid var(--gbg-charcoal-200)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    k: "publishedAt",
    label: "Published to production"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      padding: '15px 8px',
      borderBottom: '1px solid var(--gbg-charcoal-200)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    k: "updatedAt",
    label: "Updated"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 72,
      padding: '15px 24px 15px 8px',
      borderBottom: '1px solid var(--gbg-charcoal-200)'
    },
    "aria-label": "Row actions"
  }))), /*#__PURE__*/React.createElement("tbody", null, MOCK_JOURNEYS.map(j => /*#__PURE__*/React.createElement("tr", {
    key: j.id,
    style: {
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--gbg-charcoal-50)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 8px 15px 24px',
      borderBottom: '1px solid var(--gbg-charcoal-100)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenJourney?.(j.id),
    style: {
      all: 'unset',
      cursor: 'pointer',
      color: 'var(--gbg-charcoal-700)',
      textDecoration: 'underline',
      textDecorationColor: 'var(--gbg-charcoal-700)',
      fontWeight: 700,
      fontSize: 14
    }
  }, j.name)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 8px',
      borderBottom: '1px solid var(--gbg-charcoal-100)',
      fontSize: 14,
      color: 'var(--gbg-charcoal-500)'
    }
  }, j.publishedAt), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 8px',
      borderBottom: '1px solid var(--gbg-charcoal-100)',
      fontSize: 14,
      color: 'var(--gbg-charcoal-500)'
    }
  }, j.updatedAt), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 24px 15px 8px',
      borderBottom: '1px solid var(--gbg-charcoal-100)',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setRowMenu(rowMenu?.id === j.id ? null : {
        id: j.id,
        anchor: e.currentTarget
      });
    },
    "aria-label": `Actions for ${j.name}`,
    style: {
      minWidth: 0,
      width: 32,
      height: 32,
      background: '#fff',
      border: '1px solid var(--gbg-hyacinth-400)',
      borderRadius: 4,
      color: 'var(--gbg-hyacinth-400)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-dots-three",
    style: {
      fontSize: 20
    }
  }))))))), /*#__PURE__*/React.createElement(Menu, {
    open: !!rowMenu,
    anchorEl: rowMenu?.anchor,
    onClose: () => setRowMenu(null),
    borderColor: "var(--gbg-hyacinth-400)",
    minWidth: 180
  }, /*#__PURE__*/React.createElement(MenuItem, {
    onClick: () => setRowMenu(null),
    color: "var(--gbg-hyacinth-400)"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400
    }
  }, "Archive journey"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "First page",
    disabled: page === 1,
    onClick: () => setPage(1)
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-caret-double-left",
    style: {
      fontSize: 16
    }
  })), /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Previous",
    disabled: page === 1,
    onClick: () => setPage(Math.max(1, page - 1))
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-caret-left",
    style: {
      fontSize: 16
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '0 12px',
      fontSize: 12,
      color: 'var(--gbg-charcoal-500)'
    }
  }, "Page ", page, " of ", totalPages.toLocaleString('en-GB')), /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Next",
    onClick: () => setPage(Math.min(totalPages, page + 1))
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-caret-right",
    style: {
      fontSize: 16
    }
  })), /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Last page",
    onClick: () => setPage(totalPages)
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-caret-double-right",
    style: {
      fontSize: 16
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", {
    style: {
      height: 32,
      minWidth: 72,
      padding: '0 8px',
      border: '1px solid var(--gbg-charcoal-300)',
      borderRadius: 4,
      fontFamily: 'var(--gbg-font-stack)',
      fontSize: 14,
      background: '#fff'
    },
    defaultValue: "10"
  }, /*#__PURE__*/React.createElement("option", null, "10"), /*#__PURE__*/React.createElement("option", null, "25"), /*#__PURE__*/React.createElement("option", null, "50"), /*#__PURE__*/React.createElement("option", null, "100")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--gbg-charcoal-400)'
    }
  }, "of ", totalResults.toLocaleString('en-GB'), " results")))));
}
Object.assign(window, {
  JourneysPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/go-console/JourneysPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/go-console/LoginPage.jsx
try { (() => {
/**
 * Page: Login (Sign in to Go)
 */
const {
  useState: useStateLogin
} = React;
function LoginPage({
  onSignIn
}) {
  const [email, setEmail] = useStateLogin('');
  const [password, setPassword] = useStateLogin('');
  const [error, setError] = useStateLogin(false);
  const submit = e => {
    e.preventDefault();
    if (email && password) onSignIn?.();else setError(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--gbg-charcoal-50)',
      padding: 24,
      fontFamily: 'var(--gbg-font-stack)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 28,
    variant: "full"
  })), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      background: '#fff',
      border: '1px solid var(--gbg-charcoal-200)',
      borderRadius: 8,
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--gbg-charcoal-700)',
      marginBottom: 8
    }
  }, "Sign in to Go"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--gbg-charcoal-400)',
      marginBottom: 24
    }
  }, "Use your work email to access identity verification and case management."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Work email",
    type: "email",
    value: email,
    onChange: e => {
      setEmail(e.target.value);
      setError(false);
    },
    placeholder: "you@organisation.com",
    required: true
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Password",
    type: "password",
    value: password,
    onChange: e => {
      setPassword(e.target.value);
      setError(false);
    },
    error: error,
    helperText: error ? "That email and password don't match. Check and try again, or reset your password." : undefined,
    required: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Link, {
    href: "#forgot"
  }, "Forgot your password?")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    fullWidth: true
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outlined",
    fullWidth: true
  }, "Continue with single sign-on")))));
}
Object.assign(window, {
  LoginPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/go-console/LoginPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/go-console/Primitives.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GBG Go UI Kit — shared primitive components.
 * Mirrors src/theme.ts MUI overrides without MUI. Styled with CSS vars from
 * ../../colors_and_type.css.
 *
 * React + ReactDOM are loaded globally via <script src> in index.html;
 * do NOT add `import React from 'react'` here — Babel standalone would
 * transpile that to CommonJS and break the page.
 */

const {
  useState,
  useRef,
  useEffect
} = React;

// ---------- Logo ----------
function Logo({
  height = 20,
  variant = 'full'
}) {
  if (variant === 'mark') {
    return /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logo-mark.svg",
      alt: "GBG Go",
      style: {
        height,
        display: 'block'
      }
    });
  }
  return /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-full.svg",
    alt: "GBG Go",
    style: {
      height,
      display: 'block'
    }
  });
}

// ---------- Button ----------
function Button({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
  style,
  ...rest
}) {
  const isSmall = size === 'small';
  const base = {
    height: isSmall ? 32 : 48,
    padding: isSmall ? '0 12px' : '0 16px',
    fontFamily: 'var(--gbg-font-stack)',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: fullWidth ? '100%' : undefined,
    transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
    textTransform: 'none',
    boxShadow: 'none'
  };
  const variants = {
    contained: {
      background: color === 'error' ? 'var(--gbg-red-500)' : 'var(--gbg-hyacinth-400)',
      color: '#fff'
    },
    outlined: {
      background: '#fff',
      color: color === 'error' ? 'var(--gbg-red-500)' : 'var(--gbg-hyacinth-400)',
      borderColor: color === 'error' ? 'var(--gbg-red-500)' : 'var(--gbg-hyacinth-400)'
    },
    text: {
      background: 'transparent',
      color: 'var(--gbg-hyacinth-400)',
      border: 'none',
      padding: '0 8px'
    }
  };
  const disabledStyle = disabled ? {
    background: 'var(--gbg-charcoal-200)',
    color: 'var(--gbg-charcoal-400)',
    borderColor: 'transparent'
  } : {};
  const [hover, setHover] = useState(false);
  const hoverStyle = hover && !disabled ? variant === 'contained' ? {
    background: color === 'error' ? 'var(--gbg-red-700)' : 'var(--gbg-hyacinth-300)'
  } : variant === 'outlined' ? {
    background: 'var(--gbg-hyacinth-50)'
  } : {
    background: 'var(--gbg-hyacinth-50)'
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...disabledStyle,
      ...hoverStyle,
      ...style
    }
  }, rest), startIcon, children, endIcon);
}

// ---------- IconButton ----------
function IconButton({
  onClick,
  disabled,
  ariaLabel,
  size = 32,
  style,
  children
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    disabled: disabled,
    "aria-label": ariaLabel,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hover && !disabled ? 'var(--gbg-charcoal-50)' : 'transparent',
      color: disabled ? 'var(--gbg-charcoal-300)' : 'var(--gbg-charcoal-500)',
      border: 'none',
      borderRadius: 4,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 120ms ease',
      ...style
    }
  }, children);
}

// ---------- TextField ----------
function TextField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  helperText,
  error,
  required,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? 'var(--gbg-red-500)' : focused ? 'var(--gbg-hyacinth-400)' : 'var(--gbg-charcoal-300)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block'
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--gbg-charcoal-500)',
      marginBottom: 4
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    required: required,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: 40,
      padding: '8px 12px',
      fontFamily: 'var(--gbg-font-stack)',
      fontSize: 14,
      color: 'var(--gbg-charcoal-700)',
      background: '#fff',
      border: `1px solid ${borderColor}`,
      borderRadius: 4,
      outline: 'none',
      transition: 'border-color 120ms ease'
    }
  }, rest)), helperText && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: error ? 'var(--gbg-red-700)' : 'var(--gbg-charcoal-400)',
      marginTop: 4
    }
  }, helperText));
}

// ---------- Link ----------
function Link({
  href,
  onClick,
  color,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: href || '#',
    onClick: e => {
      if (onClick) {
        e.preventDefault();
        onClick(e);
      }
    },
    style: {
      color: color || 'var(--gbg-hyacinth-400)',
      textDecoration: 'underline',
      textDecorationColor: 'currentColor',
      fontWeight: 500,
      cursor: 'pointer',
      ...style
    }
  }, children);
}

// ---------- StatusBadge ----------
const STATUS = {
  pass: {
    label: 'Passed',
    fg: 'var(--gbg-green-700)',
    bg: 'var(--gbg-green-100)'
  },
  fail: {
    label: 'Failed',
    fg: 'var(--gbg-red-700)',
    bg: 'var(--gbg-red-100)'
  },
  review: {
    label: 'In review',
    fg: 'var(--gbg-orange-700)',
    bg: 'var(--gbg-orange-100)'
  },
  pending: {
    label: 'Pending',
    fg: 'var(--gbg-charcoal-500)',
    bg: 'var(--gbg-charcoal-50)'
  }
};
function StatusBadge({
  status,
  label
}) {
  const c = STATUS[status];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '2px 8px',
      borderRadius: 2,
      background: c.bg,
      color: c.fg,
      fontSize: 12,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: c.fg,
      display: 'inline-block'
    }
  }), label || c.label);
}

// ---------- Chip ----------
function Chip({
  label,
  onDelete
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 20,
      padding: '0 8px',
      background: '#fff',
      border: '1px solid var(--gbg-charcoal-200)',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--gbg-charcoal-500)'
    }
  }, label, onDelete && /*#__PURE__*/React.createElement("button", {
    onClick: onDelete,
    "aria-label": "Remove filter",
    style: {
      width: 12,
      height: 12,
      border: 'none',
      background: 'none',
      color: 'var(--gbg-charcoal-400)',
      cursor: 'pointer',
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-x",
    style: {
      fontSize: 12
    }
  })));
}

// ---------- Menu (anchored dropdown) ----------
function Menu({
  open,
  anchorEl,
  onClose,
  children,
  minWidth = 180,
  borderColor
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);
  useEffect(() => {
    if (open && anchorEl) {
      const r = anchorEl.getBoundingClientRect();
      setPos({
        top: r.bottom + 8,
        left: r.right - minWidth
      });
    }
  }, [open, anchorEl, minWidth]);
  useEffect(() => {
    if (!open) return;
    const h = e => {
      if (ref.current && !ref.current.contains(e.target) && !anchorEl?.contains(e.target)) onClose?.();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, anchorEl, onClose]);
  if (!open || !pos) return null;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'fixed',
      top: pos.top,
      left: pos.left,
      minWidth,
      background: '#fff',
      border: `1px solid ${borderColor || 'var(--gbg-charcoal-200)'}`,
      borderRadius: 4,
      boxShadow: '0 4px 12px rgba(0,0,0,.08)',
      padding: '4px 0',
      zIndex: 100
    }
  }, children);
}
function MenuItem({
  onClick,
  primary,
  secondary,
  color,
  children
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '10px 16px',
      background: hover ? 'var(--gbg-charcoal-50)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--gbg-font-stack)',
      fontSize: 14,
      color: color || 'var(--gbg-charcoal-700)'
    }
  }, children || /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: 'inherit'
    }
  }, primary), secondary && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--gbg-charcoal-400)',
      fontWeight: 400,
      marginTop: 2
    }
  }, secondary)));
}
Object.assign(window, {
  Logo,
  Button,
  IconButton,
  TextField,
  Link,
  StatusBadge,
  Chip,
  Menu,
  MenuItem
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/go-console/Primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/go-console/SettingsPage.jsx
try { (() => {
/**
 * Page: Settings — API keys (form-heavy pattern)
 */
const {
  useState: useStateS
} = React;
function SettingsPage() {
  const [section, setSection] = useStateS('apiKeys');
  const sections = [{
    key: 'account',
    label: 'Your account'
  }, {
    key: 'apiKeys',
    label: 'API keys'
  }, {
    key: 'webhooks',
    label: 'Webhooks'
  }, {
    key: 'decisionRules',
    label: 'Decision rules'
  }, {
    key: 'members',
    label: 'Team members'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    heading: "Settings"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      width: 220,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, sections.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    onClick: () => setSection(s.key),
    style: {
      all: 'unset',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: 8,
      color: section === s.key ? 'var(--gbg-hyacinth-400)' : 'var(--gbg-charcoal-500)',
      background: section === s.key ? 'var(--gbg-hyacinth-100)' : 'transparent',
      fontSize: 14,
      fontWeight: section === s.key ? 700 : 500
    }
  }, s.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, section === 'apiKeys' && /*#__PURE__*/React.createElement(ApiKeysSection, null), section !== 'apiKeys' && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 48,
      textAlign: 'center',
      border: '1px solid var(--gbg-charcoal-200)',
      borderRadius: 8,
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--gbg-charcoal-400)'
    }
  }, "Placeholder \u2014 pattern mirrors the API keys section.")))));
}
function ApiKeysSection() {
  const keys = [{
    id: 'k_01',
    name: 'Production',
    created: '11 Apr 2025',
    lastUsed: '20 Apr 2025 12:05'
  }, {
    id: 'k_02',
    name: 'Staging',
    created: '1 Mar 2024',
    lastUsed: '18 Apr 2025 10:12'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 18,
      fontWeight: 800,
      color: 'var(--gbg-charcoal-700)'
    }
  }, "API keys"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: 'var(--gbg-charcoal-500)',
      maxWidth: 560
    }
  }, "Use these keys to call the Go API from your systems. Rotate keys if you suspect they have been exposed.")), /*#__PURE__*/React.createElement(Button, {
    size: "small"
  }, "Create a key")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--gbg-orange-100)',
      color: 'var(--gbg-orange-700)',
      border: '1px solid var(--gbg-orange-100)',
      borderRadius: 4,
      padding: '10px 12px',
      fontSize: 13,
      fontWeight: 500,
      marginBottom: 16
    }
  }, "Treat API keys like passwords. Anyone with a key can make requests on behalf of your organisation."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid var(--gbg-charcoal-200)',
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      fontFamily: 'var(--gbg-font-stack)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Name"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Created"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Last used"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 180
    }
  }))), /*#__PURE__*/React.createElement("tbody", null, keys.map(k => /*#__PURE__*/React.createElement("tr", {
    key: k.id
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--gbg-charcoal-700)'
    }
  }, k.name)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, k.created), /*#__PURE__*/React.createElement("td", {
    style: td
  }, k.lastUsed), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    variant: "outlined"
  }, "Rotate"), /*#__PURE__*/React.createElement(Button, {
    size: "small",
    variant: "outlined",
    color: "error"
  }, "Revoke")))))))));
}
const th = {
  textAlign: 'left',
  padding: '15px 8px',
  borderBottom: '1px solid var(--gbg-charcoal-200)',
  fontWeight: 800,
  fontSize: 14,
  color: 'var(--gbg-charcoal-700)'
};
const td = {
  padding: '15px 8px',
  borderBottom: '1px solid var(--gbg-charcoal-100)',
  fontSize: 14,
  color: 'var(--gbg-charcoal-500)'
};
Object.assign(window, {
  SettingsPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/go-console/SettingsPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/go-console/Shell.jsx
try { (() => {
/**
 * Sidebar + page shell.
 */
const {
  useState
} = React;
const PRIMARY_NAV = [{
  key: 'journeys',
  label: 'Journeys',
  icon: 'ph-path'
}, {
  key: 'investigation',
  label: 'Investigation',
  icon: 'ph-users'
}, {
  key: 'analytics',
  label: 'Analytics',
  icon: 'ph-chart-line-up'
}, {
  key: 'accounts',
  label: 'Account management',
  icon: 'ph-users-three'
}, {
  key: 'admin',
  label: 'Administration',
  icon: 'ph-shield-star'
}, {
  key: 'subOrgs',
  label: 'Sub-organisations',
  icon: 'ph-tree-structure'
}];
const SECONDARY_NAV = [{
  key: 'settings',
  label: 'Settings',
  icon: 'ph-gear'
}, {
  key: 'audit',
  label: 'Audit log',
  icon: 'ph-clipboard-text'
}, {
  key: 'docs',
  label: 'Documentation',
  icon: 'ph-book-open'
}, {
  key: 'privacy',
  label: 'Privacy policy',
  icon: 'ph-shield-check'
}, {
  key: 'signout',
  label: 'Log out',
  icon: 'ph-sign-out'
}];
function NavLabelled({
  item,
  active,
  onClick,
  height = 44
}) {
  const [hover, setHover] = useState(false);
  const isHover = hover && !active;
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onClick?.(item.key);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 12px',
      height,
      borderRadius: 8,
      textDecoration: 'none',
      color: active ? 'var(--gbg-hyacinth-400)' : 'var(--gbg-charcoal-500)',
      background: active || isHover ? 'var(--gbg-hyacinth-100)' : 'transparent',
      fontSize: 14,
      fontWeight: active ? 700 : 500,
      transition: 'background 120ms ease, color 120ms ease'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph${active ? '-bold' : ''} ${item.icon}`,
    style: {
      fontSize: 20,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", null, item.label));
}
function NavIcon({
  item,
  active,
  onClick,
  size = 44
}) {
  const [hover, setHover] = useState(false);
  const isHover = hover && !active;
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onClick?.(item.key);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    title: item.label,
    "aria-label": item.label,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: 8,
      color: active ? 'var(--gbg-hyacinth-400)' : 'var(--gbg-charcoal-500)',
      background: active || isHover ? 'var(--gbg-hyacinth-100)' : 'transparent',
      textDecoration: 'none',
      transition: 'background 120ms ease, color 120ms ease'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph${active ? '-bold' : ''} ${item.icon}`,
    style: {
      fontSize: 20
    }
  }));
}
function Sidebar({
  current,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 280,
      flexShrink: 0,
      borderRight: '1px solid var(--gbg-charcoal-200)',
      background: 'var(--gbg-surface-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      marginBottom: 32,
      height: 20
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 20,
    variant: "full"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: 1
    }
  }, PRIMARY_NAV.map(it => /*#__PURE__*/React.createElement(NavLabelled, {
    key: it.key,
    item: it,
    active: it.key === current,
    onClick: onNavigate
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, SECONDARY_NAV.map(it => /*#__PURE__*/React.createElement(NavLabelled, {
    key: it.key,
    item: it,
    active: it.key === current,
    onClick: onNavigate,
    height: 36
  }))));
}
function CompactSidebar({
  current,
  onNavigate,
  subTab,
  onSubTab
}) {
  const subTabs = [{
    key: 'dashboard',
    label: 'Dashboard'
  }, {
    key: 'builder',
    label: 'Journey builder'
  }, {
    key: 'editor',
    label: 'Interaction editor'
  }, {
    key: 'brand',
    label: 'Branding'
  }, {
    key: 'translate',
    label: 'Translations'
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 280,
      flexShrink: 0,
      borderRight: '1px solid var(--gbg-charcoal-200)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 68,
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      background: 'var(--gbg-surface-sidebar)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 20,
    variant: "full"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 68,
      flexShrink: 0,
      background: 'var(--gbg-surface-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      padding: '8px 4px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      flex: 1
    }
  }, PRIMARY_NAV.map(it => /*#__PURE__*/React.createElement(NavIcon, {
    key: it.key,
    item: it,
    active: it.key === current,
    onClick: onNavigate
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    }
  }, SECONDARY_NAV.map(it => /*#__PURE__*/React.createElement(NavIcon, {
    key: it.key,
    item: it,
    active: it.key === current,
    onClick: onNavigate,
    size: 36
  })))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      background: '#fff',
      padding: '24px 12px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate?.('journeys');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 24,
      padding: '0 8px',
      color: 'var(--gbg-charcoal-700)',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-caret-left",
    style: {
      fontSize: 16
    }
  }), "Journeys"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, subTabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    onClick: () => onSubTab?.(t.key),
    style: {
      all: 'unset',
      cursor: 'pointer',
      display: 'block',
      width: '100%',
      padding: '8px 12px',
      borderRadius: 8,
      color: subTab === t.key ? 'var(--gbg-hyacinth-400)' : 'var(--gbg-charcoal-700)',
      fontWeight: subTab === t.key ? 700 : 500,
      fontSize: 14
    }
  }, t.label))))));
}
function AppShell({
  current,
  onNavigate,
  compact,
  subTab,
  onSubTab,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--gbg-surface-page)'
    }
  }, compact ? /*#__PURE__*/React.createElement(CompactSidebar, {
    current: current,
    onNavigate: onNavigate,
    subTab: subTab,
    onSubTab: onSubTab
  }) : /*#__PURE__*/React.createElement(Sidebar, {
    current: current,
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: compact ? 0 : 40
    }
  }, children));
}
function PageHeader({
  heading,
  subheading,
  actions,
  placement = 'end'
}) {
  if (placement === 'inline') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 32
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 40,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontSize: 22,
        lineHeight: 1.5,
        fontWeight: 800,
        color: 'var(--gbg-charcoal-700)'
      }
    }, heading), actions && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, actions)), subheading && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 14,
        color: 'var(--gbg-charcoal-400)'
      }
    }, subheading));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 32,
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      lineHeight: 1.5,
      fontWeight: 800,
      color: 'var(--gbg-charcoal-700)'
    }
  }, heading), subheading && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 14,
      color: 'var(--gbg-charcoal-400)'
    }
  }, subheading)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, actions));
}
Object.assign(window, {
  AppShell,
  Sidebar,
  CompactSidebar,
  PageHeader,
  PRIMARY_NAV,
  SECONDARY_NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/go-console/Shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Link = __ds_scope.Link;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.TextField = __ds_scope.TextField;

})();
