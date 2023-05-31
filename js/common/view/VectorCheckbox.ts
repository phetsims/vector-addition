// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorCheckbox is a checkbox that is labeled with a vector symbol and vector arrow.
 * It's used to control the visibility of the sum ('c' or 'f') vector in the Equations screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color, HBox, TColor } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';
import VectorAdditionCheckbox, { VectorAdditionCheckboxOptions } from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  vectorFill?: TColor;
  vectorStroke?: TColor;
};

type VectorCheckboxOptions = SelfOptions;

export default class VectorCheckbox extends VectorAdditionCheckbox {

  public constructor( vectorVisibleProperty: Property<boolean>, symbol: string, providedOptions?: VectorCheckboxOptions ) {

    const options = optionize<VectorCheckboxOptions, SelfOptions, VectorAdditionCheckboxOptions>()( {

      // SelfOptions
      vectorFill: Color.WHITE,
      vectorStroke: Color.BLACK
    }, providedOptions );

    const symbolNode = new ArrowOverSymbolNode( symbol, {
      maxWidth: 95 // determined empirically
    } );

    const icon = VectorAdditionIconFactory.createVectorIcon( {
      fill: options.vectorFill,
      stroke: options.vectorStroke,
      length: 35
    } );

    const content = new HBox( {
      spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
      children: [ symbolNode, icon ]
    } );

    super( vectorVisibleProperty, content, options );
  }
}

vectorAddition.register( 'VectorCheckbox', VectorCheckbox );