import * as React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { RNIContextMenuViewModule } from './RNIContextMenuViewModule';
import { RNIContextMenuNativeView } from './RNIContextMenuNativeView';

import type { RNIContextMenuViewProps } from './RNIContextMenuViewTypes';
import { MenuElementConfig } from '../../types/MenuConfig';


export class RNIContextMenuView extends React.PureComponent<RNIContextMenuViewProps> {
  
  nativeRef?: View;
  reactTag?: number;

  constructor(props: RNIContextMenuViewProps){
    super(props);
  };

  componentWillUnmount(){
    this.notifyOnComponentWillUnmount(false);
  };

  getNativeRef: () => View | undefined = () => {
    return this.nativeRef;
  };

  getNativeReactTag: () => number | undefined = () => {
    // @ts-ignore
    return this.nativeRef?.nativeTag ?? this.reactTag
  };

  notifyOnComponentWillUnmount = async (isManuallyTriggered: boolean = true) => {
    const reactTag = this.getNativeReactTag();
    if(typeof reactTag !== 'number') return;

    await RNIContextMenuViewModule.notifyOnComponentWillUnmount(
      reactTag, 
      isManuallyTriggered
    );
  };

  dismissMenu = async () => {
    const reactTag = this.getNativeReactTag();


    console.log("RNIContextMenuView - dismissMenu - 1 - reactTag:", reactTag);

    if(typeof reactTag !== 'number') return;
    console.log("RNIContextMenuView - dismissMenu - 2");

    const result = await RNIContextMenuViewModule.dismissMenu(reactTag);
    console.log("RNIContextMenuView - dismissMenu - 3");
    console.log("RNIContextMenuView - dismissMenu - result:", result);

  };

  provideDeferredElements = async (
    deferredID: string, 
    menuItems: MenuElementConfig[]
  ) => {
    const reactTag = this.getNativeReactTag();
    if(typeof reactTag !== 'number') return;

    await RNIContextMenuViewModule.provideDeferredElements(reactTag, { 
      deferredID, 
      menuItems 
    });
  };

  private _handleOnLayout = ({nativeEvent}: LayoutChangeEvent) => {
    // @ts-ignore
    this.reactTag = nativeEvent.target;
  };

  private _handleOnNativeRef = (ref: View) => {
    this.nativeRef = ref;
  };

  render(){
    return React.createElement(RNIContextMenuNativeView, {
      ...this.props,
      ...((this.reactTag == null) && {
        onLayout: this._handleOnLayout,
      }),
      // @ts-ignore
      ref: this._handleOnNativeRef,
      style: [
        this.props.style,
        styles.nativeView
      ],
    });
  };
};

const styles = StyleSheet.create({
  nativeView: {
  },
});