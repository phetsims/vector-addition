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

    const vectorSet1SizeProperty = new DerivedProperty(
      [ model.sceneProperty, model.cartesianScene.vectorSet1.vectors.lengthProperty, model.polarScene.vectorSet1.vectors.lengthProperty ],
      ( scene, numberOfCartesianVectors, numberOfPolarVectors ) => scene.vectorSet1.vectors.lengthProperty.value );

    const vectorSet2SizeProperty = new DerivedProperty(
      [ model.sceneProperty, model.cartesianScene.vectorSet2.vectors.lengthProperty, model.polarScene.vectorSet2.vectors.lengthProperty ],
      ( scene, numberOfCartesianVectors, numberOfPolarVectors ) => scene.vectorSet2.vectors.lengthProperty.value );

    const vectorSet1SymbolProperty = new DerivedProperty( [ model.sceneProperty ],
      scene => scene.vectorSet1.symbolProperty.value );

    const vectorSet2SymbolProperty = new DerivedProperty( [ model.sceneProperty ],
      scene => scene.vectorSet2.symbolProperty.value );

    const sceneNameStringProperty = new DerivedStringProperty(
      [ model.sceneProperty, model.cartesianScene.sceneNameStringProperty, model.polarScene.sceneNameStringProperty ],
      scene => scene.sceneNameStringProperty.value );

    const currentDetailsStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.labScreen.screenSummary.currentDetailsStringProperty, {
      vectorSet1Size: vectorSet1SizeProperty,
      vectorSet1Symbol: vectorSet1SymbolProperty,
      vectorSet2Size: vectorSet2SizeProperty,
      vectorSet2Symbol: vectorSet2SymbolProperty,
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