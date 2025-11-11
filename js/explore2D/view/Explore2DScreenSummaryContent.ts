// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DScreenSummaryContent is the description screen summary for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ExploreScene from '../../common/model/ExploreScene.js';

export default class Explore2DScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<ExploreScene>, scenes: ExploreScene[] ) {

    // Number of vectors on the graph.
    const numberOfVectorsProperty = DerivedProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet.numberOfVectorsOnGraphProperty ) ],
      () => sceneProperty.value.vectorSet.numberOfVectorsOnGraphProperty.value );

    // Name of the selected scene.
    const accessibleSceneNameStringProperty = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.accessibleSceneNameStringProperty ) ],
      () => sceneProperty.value.accessibleSceneNameStringProperty.value );

    const currentDetailsStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.explore2DScreen.screenSummary.currentDetailsStringProperty, {
      numberOfVectors: numberOfVectorsProperty,
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