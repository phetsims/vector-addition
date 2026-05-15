// Copyright 2025-2026, University of Colorado Boulder

/**
 * Explore1DScreenSummaryContent is the description screen summary for the 'Explore 1D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionFluent from '../../VectorAdditionFluent.js';

export default class Explore1DScreenSummaryContent extends ScreenSummaryContent {

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

    const currentDetailsStringProperty = VectorAdditionFluent.a11y.explore1DScreen.screenSummary.currentDetails.createProperty( {
      numberOfVectors: new DerivedProperty(
        [ sumVisibleProperty, resultantIsDefinedProperty, numberOfVectorsProperty ],
        ( sumVisible, resultantIsDefined, numberOfVectors ) => ( sumVisible && resultantIsDefined ) ? numberOfVectors + 1 : numberOfVectors
      ),
      sceneName: accessibleSceneNameStringProperty
    } );

    super( {
      playAreaContent: VectorAdditionFluent.a11y.explore1DScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: VectorAdditionFluent.a11y.explore1DScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: VectorAdditionFluent.a11y.explore1DScreen.screenSummary.interactionHintStringProperty
    } );
  }
}
