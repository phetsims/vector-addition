// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DScreenSummaryContent is the description screen summary for the 'Explore 1D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DModel from '../model/Explore1DModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class Explore1DScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: Explore1DModel ) {

    const numberOfVectorsProperty = new DerivedProperty(
      [ model.sceneProperty, model.horizontalScene.vectorSet.vectors.lengthProperty, model.verticalScene.vectorSet.vectors.lengthProperty ],
      ( scene, numberOfCartesianVectors, numberOfPolarVectors ) => scene.vectorSet.vectors.lengthProperty.value );

    const sceneNameStringProperty = new DerivedStringProperty(
      [ model.sceneProperty, model.horizontalScene.sceneNameStringProperty, model.verticalScene.sceneNameStringProperty ],
      scene => scene.sceneNameStringProperty.value );

    const currentDetailsStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.explore1DScreen.screenSummary.currentDetailsStringProperty, {
      numberOfVectors: numberOfVectorsProperty,
      sceneName: sceneNameStringProperty
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