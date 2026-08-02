# Responsive Workspace Behavior

This document covers application-specific reflow. Shared breakpoint and motion rules live in `responsive-and-motion.md`.

## Shell

- Desktop: persistent sidebar is allowed when content retains enough width.
- Tablet: use a narrower rail or overlay navigation based on information density.
- Mobile: sidebar becomes a labeled sheet/drawer; main content has no permanent left offset.
- Topbar actions wrap or move into an overflow menu without hiding the primary action.

## Cards and metrics

- Multi-column metric grids collapse from 4/3 columns to 2 and then 1.
- Do not reduce metric text until labels become unreadable; reflow first.
- Keep units/timeframes attached to values.

## Tables

Choose one strategy deliberately:

1. Hide low-priority columns and expose a detail view.
2. Use a labeled horizontal scroll region.
3. Convert each row into a structured card/list item.
4. Preserve a data grid only when the minimum supported width allows it.

Bulk selection, sticky columns, menus, and row actions must remain usable with keyboard and touch.

## Forms

- Two-column forms collapse to one column before labels or fields become cramped.
- Bottom actions may become a safe-area-aware mobile action bar when the workflow is long.
- Error messages remain adjacent to the relevant field.
- Step indicators may scroll horizontally or become a concise progress label.

## Overlays

- Dialogs use a bounded centered surface on desktop and may become a sheet/full-height panel on mobile.
- Ensure close controls remain visible with virtual keyboards and safe areas.
- Menus and popovers avoid off-screen positioning and content clipping.

## Dense role differences

Founder guidance can stack explanatory panels earlier. Mentor queues preserve review context. Investor tables preserve comparison columns as long as possible. These are composition choices, not separate breakpoints or token systems.
