// Copyright 2025, University of Colorado Boulder

/**
 * EquationsScreenSummaryContent is the description screen summary for the 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsScene from '../model/EquationsScene.js';

export default class EquationsScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<EquationsScene>, scenes: EquationsScene[] ) {

    // Verify that every scene has exactly 2 base vectors and 2 non-base vectors, because we'll be indexing these arrays.
    affirm( _.every( scenes, scene => scene.vectorSet.baseVectors.length === 2 ), 'Unexpected number of baseVectors.' );
    affirm( _.every( scenes, scene => scene.vectorSet.allVectors.length === 2 ), 'Unexpected number of allVectors.' );

    // The selected equation type.
    const equationTypeProperty = new DynamicProperty( sceneProperty, {
      derive: scene => scene.equationTypeProperty
    } );

    // Coefficient for the first term in the equation.
    const coefficient1Property = new DynamicProperty( sceneProperty, {
      derive: scene => scene.vectorSet.allVectors[ 0 ].coefficientProperty
    } );

    // Coefficient for the second term in the equation.
    const coefficient2Property = new DynamicProperty( sceneProperty, {
      derive: scene => scene.vectorSet.allVectors[ 1 ].coefficientProperty
    } );

    // Accessible symbol for the first term in the equation.
    const accessibleSymbol1Property = new DynamicProperty( sceneProperty, {
      derive: scene => scene.vectorSet.baseVectors[ 0 ].accessibleSymbolProperty
    } );

    // Accessible symbol for the second term in the equation.
    const accessibleSymbol2Property = new DynamicProperty( sceneProperty, {
      derive: scene => scene.vectorSet.baseVectors[ 1 ].accessibleSymbolProperty
    } );

    // Accessible symbol for the third (resultant) term in the equation.
    const accessibleSymbol3Property = new DynamicProperty( sceneProperty, {
      derive: scene => scene.vectorSet.resultantVector.accessibleSymbolProperty
    } );

    // Control Area description
    const controlAreaStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.controlAreaStringProperty, {
      symbol1: accessibleSymbol1Property,
      symbol2: accessibleSymbol2Property,
      symbol3: accessibleSymbol3Property
    } );

    // Current Details description
    const currentDetailsStringProperty = new DerivedStringProperty( [
        equationTypeProperty,
        coefficient1Property,
        accessibleSymbol1Property,
        coefficient2Property,
        accessibleSymbol2Property,
        accessibleSymbol3Property
      ],
      ( equationType, coefficient1, accessibleSymbol1, coefficient2, accessibleSymbol2, accessibleSymbol3 ) => {

        // Note that all of these string patterns must have the same placeholders.
        const patternStringProperty = ( equationType === 'addition' ) ?
                                      VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsAdditionStringProperty :
                                      ( equationType === 'subtraction' ) ?
                                      VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsSubtractionStringProperty :
                                      VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsNegationStringProperty;
        return StringUtils.fillIn( patternStringProperty, {
          coefficient1: coefficient1,
          symbol1: accessibleSymbol1,
          coefficient2: coefficient2,
          symbol2: accessibleSymbol2,
          symbol3: accessibleSymbol3
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