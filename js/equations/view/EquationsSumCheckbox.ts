// Copyright 2025, University of Colorado Boulder

/**
 * EquationsSumCheckbox is the checkbox for the sum vector in the graph control panel for the 'Equations' screen.
 * It changes its label and vector color depending on which scene is selected.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorCheckbox from '../../common/view/VectorCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import EquationsScene from '../model/EquationsScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import Property from '../../../../axon/js/Property.js';

export default class EquationsSumCheckbox extends VectorCheckbox {

  public constructor( sumVisibleProperty: Property<boolean>,
                      sceneProperty: TReadOnlyProperty<EquationsScene>,
                      cartesianScene: EquationsScene,
                      polarScene: EquationsScene,
                      tandem: Tandem ) {

    // resultant vector string, 'c' or 'f'
    const resultantVectorStringProperty = new DerivedStringProperty(
      [ sceneProperty, VectorAdditionSymbols.cStringProperty, VectorAdditionSymbols.fStringProperty ],
      ( scene, cString, fString ) => ( scene === cartesianScene ) ? cString : fString );

    // resultant vector fill
    const resultantVectorFillProperty = new DerivedProperty( [ sceneProperty ], scene =>
      ( scene === cartesianScene ) ? cartesianScene.vectorSet.vectorColorPalette.sumFill : polarScene.vectorSet.vectorColorPalette.sumFill );

    // resultant vector stroke
    const resultantVectorStrokeProperty = new DerivedProperty( [ sceneProperty ], scene =>
      ( scene === cartesianScene ) ? cartesianScene.vectorSet.vectorColorPalette.sumStroke : polarScene.vectorSet.vectorColorPalette.sumStroke );

    super( sumVisibleProperty, resultantVectorStringProperty, {
      vectorFill: resultantVectorFillProperty,
      vectorStroke: resultantVectorStrokeProperty,
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'EquationsSumCheckbox', EquationsSumCheckbox );