// Copyright 2025-2026, University of Colorado Boulder

/**
 * EquationsScreenSummaryContent is the description screen summary for the 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import VectorAdditionFluent from '../../VectorAdditionFluent.js';
import EquationsScene from '../model/EquationsScene.js';
import { EquationType } from '../model/EquationType.js';

export default class EquationsScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<EquationsScene>, scenes: EquationsScene[] ) {

    // Verify that every scene has exactly 2 base vectors and 2 non-base vectors, because we'll be indexing these arrays.
    affirm( _.every( scenes, scene => scene.vectorSet.baseVectors.length === 2 ), 'Unexpected number of baseVectors.' );
    affirm( _.every( scenes, scene => scene.vectorSet.allVectors.length === 2 ), 'Unexpected number of allVectors.' );

    // The selected equation type.
    const equationTypeProperty = new DynamicProperty<EquationType, EquationType, EquationsScene>( sceneProperty, {
      derive: scene => scene.equationTypeProperty
    } );

    // Coefficient for the first term in the equation.
    const coefficient1Property = new DynamicProperty<number, number, EquationsScene>( sceneProperty, {
      derive: scene => scene.vectorSet.allVectors[ 0 ].coefficientProperty
    } );

    // Coefficient for the second term in the equation.
    const coefficient2Property = new DynamicProperty<number, number, EquationsScene>( sceneProperty, {
      derive: scene => scene.vectorSet.allVectors[ 1 ].coefficientProperty
    } );

    // Accessible symbol for the first term in the equation.
    const accessibleSymbol1Property = new DynamicProperty<string, string, EquationsScene>( sceneProperty, {
      derive: scene => scene.vectorSet.baseVectors[ 0 ].accessibleSymbolProperty
    } );

    // Accessible symbol for the second term in the equation.
    const accessibleSymbol2Property = new DynamicProperty<string, string, EquationsScene>( sceneProperty, {
      derive: scene => scene.vectorSet.baseVectors[ 1 ].accessibleSymbolProperty
    } );

    // Accessible symbol for the third (resultant) term in the equation.
    const accessibleSymbol3Property = new DynamicProperty<string, string, EquationsScene>( sceneProperty, {
      derive: scene => scene.vectorSet.resultantVector.accessibleSymbolProperty
    } );

    // Control Area description
    const controlAreaStringProperty = VectorAdditionFluent.a11y.equationsScreen.screenSummary.controlArea.createProperty( {
      symbol1: accessibleSymbol1Property,
      symbol2: accessibleSymbol2Property,
      symbol3: accessibleSymbol3Property
    } );

    // Current Details description
    const currentDetailsStringProperty = VectorAdditionFluent.a11y.equationsScreen.screenSummary.currentDetails.createProperty( {
      equationType: equationTypeProperty,
      coefficient1: coefficient1Property,
      symbol1: accessibleSymbol1Property,
      coefficient2: coefficient2Property,
      symbol2: accessibleSymbol2Property,
      symbol3: accessibleSymbol3Property
    } );

    super( {
      playAreaContent: VectorAdditionFluent.a11y.equationsScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: VectorAdditionFluent.a11y.equationsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}
