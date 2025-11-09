// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DScreenSummaryContent is the description screen summary for the 'Explore 1D' screen.
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

export default class Explore1DScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<ExploreScene>, scenes: ExploreScene[] ) {

    const numberOfVectorsProperty = DerivedProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet.numberOfVectorsOnGraphProperty ) ],
      () => sceneProperty.value.vectorSet.numberOfVectorsOnGraphProperty.value );

    const accessibleSceneNameStringProperty = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.accessibleSceneNameStringProperty ) ],
      () => sceneProperty.value.accessibleSceneNameStringProperty.value );

    const currentDetailsStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.explore1DScreen.screenSummary.currentDetailsStringProperty, {
      numberOfVectors: numberOfVectorsProperty,
      sceneName: accessibleSceneNameStringProperty
    } );

    super( {
      playAreaContent: VectorAdditionStrings.a11y.explore1DScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: VectorAdditionStrings.a11y.explore1DScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: VectorAdditionStrings.a11y.explore1DScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

vectorAddition.register( 'Explore1DScreenSummaryContent', Explore1DScreenSummaryContent );