// Copyright 2025, University of Colorado Boulder

/**
 * LabScreenSummaryContent is the description screen summary for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import LabScene from '../model/LabScene.js';

export default class LabScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<LabScene>,
                      sum1VisibleProperty: TReadOnlyProperty<boolean>,
                      sum2VisibleProperty: TReadOnlyProperty<boolean> ) {

    // Number of vectors on the graph that belong to vector set 1.
    const mumberOfVectors1Property = new DynamicProperty<number, number, LabScene>( sceneProperty, {
      derive: scene => scene.vectorSet1.numberOfVectorsOnGraphProperty
    } );

    // Number of vectors on the graph that belong to vector set 2.
    const mumberOfVectors2Property = new DynamicProperty<number, number, LabScene>( sceneProperty, {
      derive: scene => scene.vectorSet2.numberOfVectorsOnGraphProperty
    } );

    // Whether the resultant vector is defined for vector set 1.
    const resultant1IsDefinedProperty = new DynamicProperty<boolean, boolean, LabScene>( sceneProperty, {
      derive: scene => scene.vectorSet1.resultantVector.isDefinedProperty
    } );

    // Whether the resultant vector is defined for vector set 2.
    const resultant2IsDefinedProperty = new DynamicProperty<boolean, boolean, LabScene>( sceneProperty, {
      derive: scene => scene.vectorSet2.resultantVector.isDefinedProperty
    } );

    // Symbol for vector set 1.
    const vectorSet1AccessibleSymbolProperty = new DynamicProperty<string, string, LabScene>( sceneProperty, {
      derive: scene => scene.vectorSet1.accessibleSymbolProperty
    } );

    // Symbol for vector set 2.
    const vectorSet2AccessibleSymbolProperty = new DynamicProperty<string, string, LabScene>( sceneProperty, {
      derive: scene => scene.vectorSet2.accessibleSymbolProperty
    } );

    // Name of the selected scene.
    const sceneAccessibleNameStringProperty = new DynamicProperty<string, string, LabScene>( sceneProperty, {
      derive: scene => scene.accessibleSceneNameStringProperty
    } );

    const currentDetailsStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.labScreen.screenSummary.currentDetailsStringProperty, {
      vectorSet1Size: new DerivedProperty(
        [ sum1VisibleProperty, resultant1IsDefinedProperty, mumberOfVectors1Property ],
        ( sumVisible, resultantIsDefined, numberOfVectors ) => ( sumVisible && resultantIsDefined ) ? numberOfVectors + 1 : numberOfVectors
      ),
      vectorSet1Symbol: vectorSet1AccessibleSymbolProperty,
      vectorSet2Size: new DerivedProperty(
        [ sum2VisibleProperty, resultant2IsDefinedProperty, mumberOfVectors2Property ],
        ( sumVisible, resultantIsDefined, numberOfVectors ) => ( sumVisible && resultantIsDefined ) ? numberOfVectors + 1 : numberOfVectors
      ),
      vectorSet2Symbol: vectorSet2AccessibleSymbolProperty,
      sceneName: sceneAccessibleNameStringProperty
    } );

    super( {
      playAreaContent: VectorAdditionStrings.a11y.labScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: VectorAdditionStrings.a11y.labScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: VectorAdditionStrings.a11y.labScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

vectorAddition.register( 'LabScreenSummaryContent', LabScreenSummaryContent );