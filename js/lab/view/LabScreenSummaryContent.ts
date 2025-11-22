// Copyright 2025, University of Colorado Boulder

/**
 * LabScreenSummaryContent is the description screen summary for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import LabScene from '../model/LabScene.js';

export default class LabScreenSummaryContent extends ScreenSummaryContent {

  public constructor( sceneProperty: TReadOnlyProperty<LabScene> ) {

    // Number of vectors on the graph that belong to vector set 1.
    const vectorSet1SizeProperty = new DynamicProperty( sceneProperty, {
      derive: scene => scene.vectorSet1.numberOfVectorsOnGraphProperty
    } );

    // Number of vectors on the graph that belong to vector set 2.
    const vectorSet2SizeProperty = new DynamicProperty( sceneProperty, {
      derive: scene => scene.vectorSet2.numberOfVectorsOnGraphProperty
    } );

    // Symbol for vector set 1.
    const vectorSet1AccessibleSymbolProperty = new DynamicProperty( sceneProperty, {
      derive: scene => scene.vectorSet1.accessibleSymbolProperty
    } );

    // Symbol for vector set 2.
    const vectorSet2AccessibleSymbolProperty = new DynamicProperty( sceneProperty, {
      derive: scene => scene.vectorSet2.accessibleSymbolProperty
    } );

    // Name of the selected scene.
    const sceneAccessibleNameStringProperty = new DynamicProperty( sceneProperty, {
      derive: scene => scene.accessibleSceneNameStringProperty
    } );

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