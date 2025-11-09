// Copyright 2025, University of Colorado Boulder

/**
 * LabScreenSummaryContent is the description screen summary for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsScene from '../model/EquationsScene.js';

export default class EquationsScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<EquationsScene>, scenes: EquationsScene[] ) {

    const accessibleSymbol1Property = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet.baseVectors[ 0 ].accessibleSymbolProperty ) ],
      () => sceneProperty.value.vectorSet.baseVectors[ 0 ].accessibleSymbolProperty.value );

    const accessibleSymbol2Property = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet.baseVectors[ 1 ].accessibleSymbolProperty ) ],
      () => sceneProperty.value.vectorSet.baseVectors[ 1 ].accessibleSymbolProperty.value );

    const accessibleSymbol3Property = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet.resultantVector.accessibleSymbolProperty ) ],
      () => sceneProperty.value.vectorSet.resultantVector.accessibleSymbolProperty.value );

    // Control Area description
    const controlAreaStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.controlAreaStringProperty, {
      symbol1: accessibleSymbol1Property,
      symbol2: accessibleSymbol2Property,
      symbol3: accessibleSymbol3Property
    } );

    // Current Details description
    const cartesianCurrentDetailsStringProperty = createCurrentDetailsStringProperty( scenes[ 0 ] );
    const polarCurrentDetailsStringProperty = createCurrentDetailsStringProperty( scenes[ 1 ] );
    const currentDetailsStringProperty = new DerivedStringProperty(
      [ sceneProperty, cartesianCurrentDetailsStringProperty, polarCurrentDetailsStringProperty ],
      ( scene, cartesianCurrentDetailsString, polarCurrentDetailsString ) =>
        ( scene === scenes[ 0 ] ) ? cartesianCurrentDetailsString : polarCurrentDetailsString );

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
    symbol1: vectorSet.baseVectors[ 0 ].accessibleSymbolProperty,
    coefficient2: vectorSet.allVectors[ 1 ].coefficientProperty,
    symbol2: vectorSet.baseVectors[ 1 ].accessibleSymbolProperty,
    symbol3: vectorSet.resultantVector.accessibleSymbolProperty
  };

  const additionStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsAdditionStringProperty,
    patternStringPropertyOptions );

  const subtractionStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsSubtractionStringProperty,
    patternStringPropertyOptions );

  const negationStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsNegationStringProperty,
    patternStringPropertyOptions );

  return new DerivedStringProperty(
    [ scene.equationTypeProperty, additionStringProperty, subtractionStringProperty, negationStringProperty ],
    ( equationType, additionString, subtractionString, negationString ) =>
      equationType === 'addition' ? additionString :
      equationType === 'subtraction' ? subtractionString :
      negationString );
}

vectorAddition.register( 'EquationsScreenSummaryContent', EquationsScreenSummaryContent );