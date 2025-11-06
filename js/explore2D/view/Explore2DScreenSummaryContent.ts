// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DScreenSummaryContent is the description screen summary for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import vectorAddition from '../../vectorAddition.js';
import Explore2DModel from '../model/Explore2DModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class Explore2DScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: Explore2DModel ) {

    const numberOfVectorsProperty = new DerivedProperty(
      [ model.sceneProperty, model.cartesianScene.vectorSet.numberOfVectorsOnGraphProperty, model.polarScene.vectorSet.numberOfVectorsOnGraphProperty ],
      scene => scene.vectorSet.numberOfVectorsOnGraphProperty.value );

    const accessibleSceneNameStringProperty = new DerivedStringProperty(
      [ model.sceneProperty, model.cartesianScene.accessibleSceneNameStringProperty, model.polarScene.accessibleSceneNameStringProperty ],
      scene => scene.accessibleSceneNameStringProperty.value );

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