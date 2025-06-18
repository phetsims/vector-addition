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

export default class EquationsScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: EquationsModel ) {
    super( {
      playAreaContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: VectorAdditionStrings.a11y.equationsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

vectorAddition.register( 'EquationsScreenSummaryContent', EquationsScreenSummaryContent );