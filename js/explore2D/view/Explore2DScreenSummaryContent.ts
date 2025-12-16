// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DScreenSummaryContent is the description screen summary for the 'Explore 2D' screen.
 *
 * Note: While this looks very similar to Explore1DScreenSummaryContent, it uses different descriptions strings,
 * and the scenes have different names.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class Explore2DScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<ExploreScene>, sumVisibleProperty: TReadOnlyProperty<boolean> ) {

    // Number of vectors on the graph.
    const numberOfVectorsProperty = new DynamicProperty<number, number, ExploreScene>( sceneProperty, {
      derive: scene => scene.vectorSet.numberOfVectorsOnGraphProperty
    } );

    // Whether the resultant vector is defined.
    const resultantIsDefinedProperty = new DynamicProperty<boolean, boolean, ExploreScene>( sceneProperty, {
      derive: scene => scene.vectorSet.resultantVector.isDefinedProperty
    } );

    // Accessible name of the selected scene.
    const accessibleSceneNameStringProperty = new DynamicProperty<string, string, ExploreScene>( sceneProperty, {
      derive: scene => scene.accessibleSceneNameStringProperty
    } );

    const currentDetailsStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.explore2DScreen.screenSummary.currentDetailsStringProperty, {
      numberOfVectors: new DerivedProperty(
        [ sumVisibleProperty, resultantIsDefinedProperty, numberOfVectorsProperty ],
        ( sumVisible, resultantIsDefined, numberOfVectors ) => ( sumVisible && resultantIsDefined ) ? numberOfVectors + 1 : numberOfVectors
      ),
      sceneName: accessibleSceneNameStringProperty
    } );

    super( {
      playAreaContent: VectorAdditionStrings.a11y.explore2DScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: VectorAdditionStrings.a11y.explore2DScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: VectorAdditionStrings.a11y.explore2DScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

vectorAddition.register( 'Explore2DScreenSummaryContent', Explore2DScreenSummaryContent );