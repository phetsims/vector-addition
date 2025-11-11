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
import VectorsKeyboardHelpSection from './VectorsKeyboardHelpSection.js';

export default class VectorAdditionKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  /**
   * @param includeScaleRotate - whether to include the "Scale and rotate..." row in the keyboard-help section
   *                             for vectors. This is omitted for the Equations screen.
   */
  public constructor( includeScaleRotate = true ) {

    // Sections in the left column.
    const leftSections = [

      // Vectors
      new VectorsKeyboardHelpSection( includeScaleRotate ),

      // Graph Origin
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