// Copyright 2025, University of Colorado Boulder

/**
 * EquationsScreenSummaryContent is the description screen summary for the 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsScene from '../model/EquationsScene.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class EquationsScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<EquationsScene>, scenes: EquationsScene[] ) {

    // Verify that every scene has exactly 2 base vectors and 2 non-base vectors, because we'll be indexing these arrays.
    affirm( _.every( scenes, scene => scene.vectorSet.baseVectors.length === 2 ), 'Unexpected number of baseVectors.' );
    affirm( _.every( scenes, scene => scene.vectorSet.allVectors.length === 2 ), 'Unexpected number of allVectors.' );

    // DerivedProperties that appear in the description sections.
    const equationTypeProperty = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.equationTypeProperty ) ],
      () => sceneProperty.value.equationTypeProperty.value );

    const coefficient1Property = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet.allVectors[ 0 ].coefficientProperty ) ],
      () => sceneProperty.value.vectorSet.allVectors[ 0 ].coefficientProperty.value );

    const coefficient2Property = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet.allVectors[ 1 ].coefficientProperty ) ],
      () => sceneProperty.value.vectorSet.allVectors[ 1 ].coefficientProperty.value );

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
    const currentDetailsStringProperty = DerivedStringProperty.deriveAny( [
        sceneProperty,
        equationTypeProperty,
        coefficient1Property,
        coefficient2Property,
        accessibleSymbol1Property,
        accessibleSymbol2Property,
        accessibleSymbol3Property
      ],
      () => {

        // Note that all of these string patterns must have the same placeholders.
        const patternStringProperty = ( equationTypeProperty.value === 'addition' ) ?
                                      VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsAdditionStringProperty :
                                      ( equationTypeProperty.value === 'subtraction' ) ?
                                      VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsSubtractionStringProperty :
                                      VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsNegationStringProperty;
        return StringUtils.fillIn( patternStringProperty, {
          coefficient1: coefficient1Property.value,
          symbol1: accessibleSymbol1Property.value,
          coefficient2: coefficient2Property.value,
          symbol2: accessibleSymbol2Property.value,
          symbol3: accessibleSymbol3Property.value
        } );
      } );

    super( {
      playAreaContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

vectorAddition.register( 'EquationsScreenSummaryContent', EquationsScreenSummaryContent );