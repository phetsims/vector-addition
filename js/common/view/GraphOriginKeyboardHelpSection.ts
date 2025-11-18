// Copyright 2025, University of Colorado Boulder

/**
 * GraphOriginKeyboardHelpSection is the keyboard-help section that describes how to move the graph origin.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SceneryPhetStrings from '../../../../scenery-phet/js/SceneryPhetStrings.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class GraphOriginKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    // Move
    const moveRow = KeyboardHelpSectionRow.labelWithIcon(
      SceneryPhetStrings.keyboardHelpDialog.moveStringProperty,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon(), {
        labelInnerContent: SceneryPhetStrings.a11y.keyboardHelpDialog.draggableItems.moveDescriptionStringProperty
      } );

    super( VectorAdditionStrings.keyboardHelpDialog.graphAreaOriginStringProperty, [ moveRow ] );
  }
}

vectorAddition.register( 'GraphOriginKeyboardHelpSection', GraphOriginKeyboardHelpSection );