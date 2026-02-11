// Copyright 2025-2026, University of Colorado Boulder

/**
 * GraphAreaOriginKeyboardHelpSection is the keyboard-help section that describes how to move the graph origin.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class GraphAreaOriginKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    // Move
    // Note that we are not using MoveDraggableItemsKeyboardHelpSection because a Shift modifier is not needed for the
    // origin, and MoveDraggableItemsKeyboardHelpSection has no way to omit the keyboard help for the Shift modifier.
    const moveRow = KeyboardHelpSectionRow.fromHotkeyData( KeyboardDragListener.MOVE_HOTKEY_DATA, {
      labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveStringProperty
    } );

    // 'Graph Area Origin' title
    super( VectorAdditionStrings.keyboardHelpDialog.graphAreaOriginStringProperty, [ moveRow ] );
  }
}

vectorAddition.register( 'GraphAreaOriginKeyboardHelpSection', GraphAreaOriginKeyboardHelpSection );