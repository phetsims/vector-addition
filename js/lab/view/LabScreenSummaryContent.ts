// Copyright 2025, University of Colorado Boulder

/**
 * LabScreenSummaryContent is the description screen summary for the 'Lab' screen.
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
import LabScene from '../model/LabScene.js';

export default class LabScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<LabScene>, scenes: LabScene[] ) {

    // Number of vectors on the graph that belong to vector set 1.
    const vectorSet1SizeProperty = DerivedProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet1.numberOfVectorsOnGraphProperty ) ],
      () => sceneProperty.value.vectorSet1.numberOfVectorsOnGraphProperty.value );

    // Number of vectors on the graph that belong to vector set 2.
    const vectorSet2SizeProperty = DerivedProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet2.numberOfVectorsOnGraphProperty ) ],
      () => sceneProperty.value.vectorSet2.numberOfVectorsOnGraphProperty.value );

    // Symbol for vector set 1.
    const vectorSet1AccessibleSymbolProperty = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet1.accessibleSymbolProperty ) ],
      () => sceneProperty.value.vectorSet1.accessibleSymbolProperty.value );

    // Symbol for vector set 2.
    const vectorSet2AccessibleSymbolProperty = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.vectorSet1.accessibleSymbolProperty ) ],
      () => sceneProperty.value.vectorSet2.accessibleSymbolProperty.value );

    // Name of the selected scene.
    const sceneAccessibleNameStringProperty = DerivedStringProperty.deriveAny(
      [ sceneProperty, ...scenes.map( scene => scene.accessibleSceneNameStringProperty ) ],
      () => sceneProperty.value.accessibleSceneNameStringProperty.value );

    const currentDetailsStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.labScreen.screenSummary.currentDetailsStringProperty, {
      vectorSet1Size: vectorSet1SizeProperty,
      vectorSet1Symbol: vectorSet1AccessibleSymbolProperty,
      vectorSet2Size: vectorSet2SizeProperty,
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