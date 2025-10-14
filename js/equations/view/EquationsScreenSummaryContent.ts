// Copyright 2025, University of Colorado Boulder

/**
 * LabScreenSummaryContent is the description screen summary for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsModel from '../model/EquationsModel.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

export default class EquationsScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: EquationsModel ) {

    const controlAreaStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsScreen.screenSummary.controlAreaStringProperty, {
      symbol1: new DerivedProperty( [ model.sceneProperty ], scene => scene.vectorSet.allVectors[ 0 ].symbolProperty.value ),
      symbol2: new DerivedProperty( [ model.sceneProperty ], scene => scene.vectorSet.allVectors[ 1 ].symbolProperty.value ),
      symbol3: new DerivedProperty( [ model.sceneProperty ], scene => scene.vectorSet.resultantVector.symbolProperty.value )
    } );

    super( {
      playAreaContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: controlAreaStringProperty,
      currentDetailsContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

vectorAddition.register( 'EquationsScreenSummaryContent', EquationsScreenSummaryContent );