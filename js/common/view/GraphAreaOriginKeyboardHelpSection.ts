// Copyright 2025, University of Colorado Boulder

/**
 * GraphAreaOriginKeyboardHelpSection is the keyboard-help section that describes how to move the graph origin.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class GraphAreaOriginKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    // Move
    // Note that we are not using MoveDraggableItemsKeyboardHelpSection because a Shift modifier is not needed for the
    // origin, and MoveDraggableItemsKeyboardHelpSection has no way to omit the keyboard help for the Shift modifier.
    const moveRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetFluent.keyboardHelpDialog.moveStringProperty,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon(), {
        labelInnerContent: SceneryPhetFluent.a11y.keyboardHelpDialog.draggableItems.moveDescriptionStringProperty
      } );

    // 'Graph Area Origin' title
    super( VectorAdditionStrings.keyboardHelpDialog.graphAreaOriginStringProperty, [ moveRow ] );
  }
}

vectorAddition.register( 'GraphAreaOriginKeyboardHelpSection', GraphAreaOriginKeyboardHelpSection );