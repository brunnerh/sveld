/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";
import { ButtonProps } from "./Button.svelte";

export interface SecondaryButtonProps extends ButtonProps {}

export default class SecondaryButton extends SvelteComponentTyped<
  SecondaryButtonProps,
  { click: WindowEventMap["click"] },
  { default: {} }
> {
  secondary: boolean;
}
