// Copyright 2025, University of Colorado Boulder

//TODO https://github.com/phetsims/vector-addition/issues/308 Address duplication across screens.
/**
 * Explore2DKeyboardHelpContent is the content for the keyboard-help dialog in the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import vectorAddition from '../../vectorAddition.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class Explore2DKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [
      new MoveDraggableItemsKeyboardHelpSection( {
        headingStringProperty: VectorAdditionStrings.keyboardHelpDialog.moveGraphOriginStringProperty
      } )
    ];

    // Sections in the right column.
    const rightSections = [
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections, {
      isDisposable: false
    } );
  }
}

vectorAddition.register( 'Explore2DKeyboardHelpContent', Explore2DKeyboardHelpContent );