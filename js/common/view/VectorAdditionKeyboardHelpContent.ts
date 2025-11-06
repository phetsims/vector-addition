// Copyright 2025, University of Colorado Boulder

/**
 * VectorAdditionKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import vectorAddition from '../../vectorAddition.js';
import GraphOriginKeyboardHelpSection from './GraphOriginKeyboardHelpSection.js';

export default class VectorAdditionKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    //TODO https://github.com/phetsims/vector-addition/issues/329 Section for vectors.

    // Sections in the left column.
    const leftSections = [

      // Move Graph Origin
      new GraphOriginKeyboardHelpSection()
    ];

    // Sections in the right column.
    const rightSections = [

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections, {
      isDisposable: false
    } );
  }
}

vectorAddition.register( 'VectorAdditionKeyboardHelpContent', VectorAdditionKeyboardHelpContent );