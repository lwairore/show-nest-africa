import { BreakpointOptions, ResponsiveSettings } from "ngx-owl-carousel-o";
import { mergeObjects } from "./merge-objects.util";

export enum BREAK_POINT_SLUG_NAMES {
    DESKTOP = 'desk',
    LAPTOP = 'lap',
    TABLET = 'tab',
    MOBILE = 'mob'
}

const _DESKTOP_SCREEN_RESOLUTION_SIZES = new Set([
    1920,
    1366,
    1536,
    1440,
    1280,
    1600,
    1370,
    1605,
]);

const _LAPTOP_SCREEN_RESOLUTION_SIZES = new Set([
    768,
    1030,
    1024,
    1200,
    1600,
])

const _MOBILE_SCREEN_RESOLUTION_SIZES = new Set([
    360,
    414,
    375,
    390,
    428,
    412,
    320,
    480,
    568,
    667,
    736,
    384,
    218,
    281,
])

const _TABLET_SCREEN_RESOLUTION_SIZES = new Set([
    768,
    1280,
    800,
    601,
    962,
    810,
    910,
    962,
    600,
    1024,
    834,
    1112,
    1366,
    906,
    1536,
    1200,
    1600,
])


export const constructResponsiveSettings = (
    desktopResponsiveSettings?: BreakpointOptions,
    laptopResponsiveSettings?: BreakpointOptions,
    tabletResponsiveSettings?: BreakpointOptions,
    mobileResponsiveSettings?: BreakpointOptions): ResponsiveSettings | undefined => {
    const OBJECTS_TO_MERGE: Array<{ [klass: string]: BreakpointOptions }> = [];

    if (desktopResponsiveSettings) {
        const DESKTOP_RESPONSIVE_SETTINGS: { [klass: string]: BreakpointOptions } = {};

        _DESKTOP_SCREEN_RESOLUTION_SIZES.forEach(size => {
            DESKTOP_RESPONSIVE_SETTINGS[size] = desktopResponsiveSettings;
        });

        if (DESKTOP_RESPONSIVE_SETTINGS) {
            OBJECTS_TO_MERGE.push(DESKTOP_RESPONSIVE_SETTINGS)
        }
    }

    if (laptopResponsiveSettings) {
        const LAPTOP_RESPONSIVE_SETTINGS: { [klass: string]: BreakpointOptions } = {};

        _LAPTOP_SCREEN_RESOLUTION_SIZES.forEach(size => {
            LAPTOP_RESPONSIVE_SETTINGS[size] = laptopResponsiveSettings;
        });

        if (LAPTOP_RESPONSIVE_SETTINGS) {
            OBJECTS_TO_MERGE.push(LAPTOP_RESPONSIVE_SETTINGS)
        }
    }

    if (tabletResponsiveSettings) {
        const TABLET_RESPONSIVE_SETTINGS: { [klass: string]: BreakpointOptions } = {};

        _TABLET_SCREEN_RESOLUTION_SIZES.forEach(size => {
            TABLET_RESPONSIVE_SETTINGS[size] = tabletResponsiveSettings;
        });

        if (TABLET_RESPONSIVE_SETTINGS) {
            OBJECTS_TO_MERGE.push(TABLET_RESPONSIVE_SETTINGS)
        }
    }


    if (mobileResponsiveSettings) {
        const MOBILE_RESPONSIVE_SETTINGS: { [klass: string]: BreakpointOptions } = {};

        _MOBILE_SCREEN_RESOLUTION_SIZES.forEach(size => {
            MOBILE_RESPONSIVE_SETTINGS[size] = mobileResponsiveSettings;
        });

        if (MOBILE_RESPONSIVE_SETTINGS) {
            OBJECTS_TO_MERGE.push(MOBILE_RESPONSIVE_SETTINGS)
        }
    }

    if (OBJECTS_TO_MERGE.length > 0) {
        const ALL_RESPONSIVE_SETTINGS = mergeObjects(
            OBJECTS_TO_MERGE)

        return ALL_RESPONSIVE_SETTINGS

    }
    else {
        return undefined
    }

};