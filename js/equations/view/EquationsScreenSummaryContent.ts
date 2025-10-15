// Copyright 2025, University of Colorado Boulder

/**
 * LabScreenSummaryContent is the description screen summary for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsModel from '../model/EquationsModel.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import EquationsScene from '../model/EquationsScene.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class EquationsScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: EquationsModel ) {

    // Control Area description
    const controlAreaStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.controlAreaStringProperty, {
      symbol1: new DerivedProperty( [ model.sceneProperty ], scene => scene.vectorSet.allVectors[ 0 ].accessibleSymbolProperty.value ),
      symbol2: new DerivedProperty( [ model.sceneProperty ], scene => scene.vectorSet.allVectors[ 1 ].accessibleSymbolProperty.value ),
      symbol3: new DerivedProperty( [ model.sceneProperty ], scene => scene.vectorSet.resultantVector.accessibleSymbolProperty.value )
    } );

    // Current Details description
    const cartesianCurrentDetailsStringProperty = createCurrentDetailsStringProperty( model.cartesianScene );
    const polarCurrentDetailsStringProperty = createCurrentDetailsStringProperty( model.polarScene );
    const currentDetailsStringProperty = new DerivedProperty(
      [ model.sceneProperty, cartesianCurrentDetailsStringProperty, polarCurrentDetailsStringProperty ],
      ( scene, cartesianCurrentDetailsString, polarCurrentDetailsString ) =>
        ( scene === model.cartesianScene ) ? cartesianCurrentDetailsString : polarCurrentDetailsString );

    super( {
      playAreaContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

/**
 * Creates the current details for a scene.
 */
function createCurrentDetailsStringProperty( scene: EquationsScene ): TReadOnlyProperty<string> {

  const vectorSet = scene.vectorSet;
  affirm( vectorSet.allVectors.length === 2, 'Expected vectorSet to have 2 vectors.' );

  // Options shared by all PatternStringProperty instances herein.
  const patternStringPropertyOptions = {
    coefficient1: vectorSet.allVectors[ 0 ].coefficientProperty,
    symbol1: vectorSet.allVectors[ 0 ].accessibleSymbolProperty,
    coefficient2: vectorSet.allVectors[ 1 ].coefficientProperty,
    symbol2: vectorSet.allVectors[ 1 ].accessibleSymbolProperty,
    symbol3: vectorSet.resultantVector.accessibleSymbolProperty
  };

  const additionStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsAdditionStringProperty,
    patternStringPropertyOptions );

  const subtractionStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsSubtractionStringProperty,
    patternStringPropertyOptions );

  const negationStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsNegationStringProperty,
    patternStringPropertyOptions );

  return new DerivedProperty(
    [ scene.equationTypeProperty, additionStringProperty, subtractionStringProperty, negationStringProperty ],
    ( equationType, additionString, subtractionString, negationString ) =>
      equationType === 'addition' ? additionString :
      equationType === 'subtraction' ? subtractionString :
      negationString );
}

vectorAddition.register( 'EquationsScreenSummaryContent', EquationsScreenSummaryContent );