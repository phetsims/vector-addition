// Copyright 2025, University of Colorado Boulder

/**
 * LabScreenSummaryContent is the description screen summary for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import vectorAddition from '../../vectorAddition.js';
import LabModel from '../model/LabModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

export default class LabScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: LabModel ) {

    const numberOfBlueVectorsProperty = new DerivedProperty(
      [ model.sceneProperty, model.cartesianScene.vectorSet1.vectors.lengthProperty, model.polarScene.vectorSet1.vectors.lengthProperty ],
      ( scene, numberOfCartesianVectors, numberOfPolarVectors ) => scene.vectorSet1.vectors.lengthProperty.value, {
        valueType: 'number'
      } );

    const numberOfOrangeVectorsProperty = new DerivedProperty(
      [ model.sceneProperty, model.cartesianScene.vectorSet2.vectors.lengthProperty, model.polarScene.vectorSet2.vectors.lengthProperty ],
      ( scene, numberOfCartesianVectors, numberOfPolarVectors ) => scene.vectorSet2.vectors.lengthProperty.value, {
        valueType: 'number'
      } );

    const color1StringProperty = new DerivedProperty(
      [ model.sceneProperty, VectorAdditionStrings.a11y.cartesianVectorSet1ColorStringProperty, VectorAdditionStrings.a11y.polarVectorSet1ColorStringProperty ],
      scene => ( scene === model.cartesianScene ) ?
               VectorAdditionStrings.a11y.cartesianVectorSet1ColorStringProperty.value :
               VectorAdditionStrings.a11y.polarVectorSet1ColorStringProperty.value );

    const color2StringProperty = new DerivedProperty(
      [ model.sceneProperty, VectorAdditionStrings.a11y.cartesianVectorSet2ColorStringProperty, VectorAdditionStrings.a11y.polarVectorSet2ColorStringProperty ],
      scene => ( scene === model.cartesianScene ) ?
               VectorAdditionStrings.a11y.cartesianVectorSet2ColorStringProperty.value :
               VectorAdditionStrings.a11y.polarVectorSet2ColorStringProperty.value );

    const sceneNameStringProperty = new DerivedStringProperty(
      [ model.sceneProperty, model.cartesianScene.sceneNameStringProperty, model.polarScene.sceneNameStringProperty ],
      scene => scene.sceneNameStringProperty.value );

    const currentDetailsStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.labScreen.screenSummary.currentDetailsStringProperty, {
      numberOfVectors1: numberOfBlueVectorsProperty,
      color1: color1StringProperty,
      numberOfVectors2: numberOfOrangeVectorsProperty,
      color2: color2StringProperty,
      sceneName: sceneNameStringProperty
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