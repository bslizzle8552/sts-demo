# STS Touchscreen Accuracy Pass

Completed on 2026-06-21. Updated on 2026-06-22.

## Source Set Used

- STS Controller 2.0 manual text and rendered screenshots under `tmp/manual`.
- SN7509S / 100 HP tech data sheet text in `tmp-Tech-SN75S-TDS-000349r00.txt`.
- Four supporting PDFs indexed under `tmp/pdf-reference`, especially `tmp/pdf-reference/reading-notes.md`.

## Completed

- Preserved the physical controller frame and hardware controls.
- Kept touchscreen text, values, menus, timestamps, and changing data as real DOM/UI text.
- Retained the manual-style mimic home image and live overlays for state, mode, counters, pressure, temperature, capacity, and time.
- Rebuilt the analog/digital home screen from the manual raster screenshot with live overlays for status, counters, gauge centers, and time; the baked manual needles were removed from the raster source and replaced with live raster pointer sprites so the dials move with compressor readings.
- Rebuilt the multigauge home screen from the manual raster screenshot with live overlays for status, counters, capacity, gauge fills, E-Mode access, and time; the soft screenshot title row was cleaned from the source image and replaced with crisp live labels.
- Wired the manual User Preferences Home Screen field so it cycles Mimic, Multi Gauge, and Analog/Digital, persists the selection, and makes the touchscreen Home icon return to the selected home screen.
- Rebuilt the I/O Status screen from the manual raster screenshot with live indicator overlays, line pressure, clock, and back/home hotspots.
- Added live raster LED overlays to the Digital I/O Details manual screen so raw inputs and outputs now reflect compressor state, mode, warnings, faults, fan status, load/unload state, and communications status.
- Rebuilt the Log In flow from manual raster screenshots for access-level selection and the touchscreen keyboard.
- Reworked the Main Menu, System Information, System Configuration, and Maintenance menu pages into full-screen STS-style pages with raster back/home icons and no simulator top/bottom chrome.
- Tightened the Main Menu, System Information, and System Configuration pages to better match STS touchscreen navigation: white title band, blue menu area, grey industrial buttons, live pressure/time footer, and no generic browser-style scroll panel on the SN7509S configuration menu.
- Replaced the Maintenance menu page with the high-resolution manual raster screenshot, transparent touch regions for all six maintenance buttons, and a live pressure/time footer.
- Rebuilt the Machine Information, Controller Software, and Package Information screens from manual raster screenshots with live overlay values, pressure, clock, and back/home hotspots.
- Rebuilt the Current Chart, Recommended Service, Event History, Current Transducer Settings, Spiral Valve Setting, Log File, and Clean Display screens from applicable manual raster screenshots with live overlay values/hotspots where needed.
- Rebuilt the Preference, Schedule, Analog Details, Digital I/O Details, Display Information, and E-Mode screens from manual raster screenshots; applicable screens now run inside the same full-screen manual shell.
- Rebuilt Spiral Valve Status, Remote, IPI Setting, Set Date & Time, and Modbus Settings from manual raster screenshots with live values overlaid in the input boxes and footer.
- Added the manual Baud Rate selection popup to Modbus Settings; tapping the Baud Rate field now opens the raster selector and updates the live field value.
- Rebuilt Networking, Maximum User Unload Settings, Analog Zero Trims, Initialization, Register, and Signal Address from high-resolution manual screenshots; these System Configuration routes now use the same full-screen manual shell and live footer.
- Added the manual Signal Address option selector; tapping a signal field opens the raster option window, keeps the selected value as live UI text, and writes the selection back to the field with OK.
- Rebuilt Sensor Log Rate and Machine Profiles from high-resolution manual screenshots; Sensor Log Rate now opens the manual Sample Rate selection popup and keeps the selected sample value as live UI text.
- Rebuilt Software Upgrade from high-resolution manual screenshots, including the main update screen plus HMI Software and ACB Software nested views with manual-raster buttons and invisible touch regions.
- Added live, legible values to the Schedule, Networking, Analog Zero Trims, and Maximum User Unload Settings manual-raster screens without adding drawn or vector screen artwork.
- Tightened the shared manual-screen footer masking so current pressure and date/time overlays cover stale screenshot footer values more cleanly.
- Left Recommended Service as a clean manual raster after a live-row overlay trial looked too visibly patched.
- Corrected Graphs to match the manual flow: Graphs now opens the raster selection screen first, then Temperature, Pressure, or Current chart screenshots with transparent controls instead of custom-drawn chart lines.
- Rebuilt the Warnings screen from a high-resolution manual raster crop, replacing the variable-speed-only overtemperature row with a fixed-speed Low Line Pressure row and live warning indicators.
- Corrected Reboot Display behavior to match the manual: selecting it no longer opens a confirmation dialog and returns the display to the home screen after a brief reboot transition.
- Rebuilt Control Parameters from a fresh manual raster crop with fixed-speed/spiral-valve fields, live editable values, pressure/time footer, and back/home hotspots.
- Corrected the SN7509S System Configuration menu by enabling Spiral Valve Settings and removing variable-speed/water-only entries that do not apply to this fixed-speed air-cooled spiral-valve unit.
- Disabled the Sequencing and Sequence Settings menu buttons because the supplied STS manual refers that area to a separate Sequencing & Protocol Manual not present in the source set; this removes the invented generic sequence form.
- Added a bottom touchscreen status strip with line pressure, operating mode, and date/time.
- Expanded the menu hierarchy with reachable STS-style screens for controller/software, digital I/O details, analog details, display information, user preferences, scheduling, E-Mode, remote, IPI, time/date, Modbus, current transducer, recommended service, clean display, reboot display, and log file.
- Added realistic SN7509S compressor data: 125 psig full-load pressure, 457 acfm full-load capacity, 89.7 kW full-load package power, 22.5 kW zero-flow power, 100 hp motor, 3 hp fan, 8200 cfm fan flow, 71 dBA sound rating, 460V package current, dimensions, connections, and filter ratings.
- Improved simulation behavior for load/unload, automatic standby/restart, spiral-valve modulation, discharge temperature, sump pressure, package kW, current, delivery CFM, motor rpm, fan frequency, and service/event data.
- Removed variable-speed-drive-only menu routes from this active profile because the SN7509S reference build is a fixed-speed spiral-valve compressor.
- Removed old SVG/vector process drawing remnants, stale shape-built gauge/icon styles, and the unused rejected generated mimic asset; the home screens now rely on raster manual screen images plus live text/value overlays.

## Remaining Gaps

- The active machine profile is the single-stage SN7509S AC profile. Two-stage oil-flooded, two-stage oil-free, and DS280-450 mimic diagrams are represented in the reference material but are not generated as separate process art yet.
- No full touchscreen screens are baked into generated images. Complex visual assets come from existing project/manual raster image assets or future image-generation passes.

## Verification

- `npm.cmd run build` passed.
- `npm.cmd run lint` passed.
- Browser visual checks passed for mimic, analog/digital, multigauge, login select, login keyboard, I/O status, main menu, system information menu, system configuration menu, Spiral Valve Settings, graphs, control parameters, recommended service, Preference, Schedule, E-Mode, Analog Details, Digital I/O Details, and Display Information screens.
- Browser visual checks passed for the newly converted Spiral Valve Status, Remote, IPI Setting, Set Date & Time, and Modbus Settings screens.
- Browser visual checks passed for Digital I/O Details with live raster LED overlays, current pressure, current clock, and no console errors.
- Browser visual checks passed for the Modbus Baud Rate popup, including opening the manual selector, choosing a different rate, closing with OK, and confirming the field updates.
- Browser visual checks passed for the Warnings screen, Control Parameters screen, and Reboot Display returning to the mimic home screen.
- Browser visual checks passed for the raster Maintenance menu and confirmed Warnings and Log File route correctly from its manual touch targets.
- Browser visual checks confirmed Sequencing and Sequence Settings are visible but disabled, with no generic sequence screen route remaining.
- Browser visual checks passed for the newly enabled Networking, Maximum User Unload Settings, Analog Zero Trims, Initialization, Register, and Signal Address screens; each manual asset loaded without console errors.
- Browser visual checks passed for the Signal Address option selector, including opening the manual raster window, selecting an input option, confirming with OK, and seeing the field update.
- Browser visual checks passed for Sensor Log Rate, its Sample Rate popup, sample-rate selection, and Machine Profiles; each manual asset loaded without console errors.
- Browser visual checks passed for Software Upgrade, HMI Software, and ACB Software; the manual-raster assets loaded, touch regions switched views, and no focus outlines or footer double-print were visible.
- Browser visual checks passed for the Graphs selection screen and Temperature, Pressure, and Current chart views; the manual-raster assets loaded, the chart choices navigated correctly, and stale drawn-chart hooks were removed.
- Browser visual checks passed for the updated Schedule, Networking, Analog Zero Trims, Maximum User Unload Settings, and clean Recommended Service pages, with no console errors.
- Browser visual checks passed for the tightened Main Menu, System Information menu, and System Configuration menu; the SN7509S configuration items fit without clipping or a visible scroll bar.
- Browser visual checks passed for direct analog/digital and multigauge home-screen startup views; after a live start command, the analog raster pointers changed rotation, all three analog readout circles measured square/equal, and the multigauge vertical fills plus capacity bar moved with compressor readings.
- Browser navigation checks passed for changing the Home Screen preference from Mimic to Multi Gauge and then Analog/Digital, using the Home icon, and confirming the selected home screen survives reload.
- Project scan found no SVG/vector markers and no fixed-speed-inappropriate variable-speed text in `src`, `public`, `docs`, or `index.html`.
- No browser console errors were observed during verification.
