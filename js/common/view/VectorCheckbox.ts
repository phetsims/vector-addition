// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorCheckbox is a checkbox that is labeled with a vector symbol and vector arrow.
 * It's used to control the visibility of the sum ('c' or 'f') vector in the Equations screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';
import VectorAdditionCheckbox, { VectorAdditionCheckboxOptions } from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';

type SelfOptions = {
  vectorFill?: TColor;
  vectorStroke?: TColor;
};

type VectorCheckboxOptions = SelfOptions;

export default class VectorCheckbox extends VectorAdditionCheckbox {

  public constructor( vectorVisibleProperty: Property<boolean>,
                      symbolProperty: TReadOnlyProperty<string>,
                      providedOptions?: VectorCheckboxOptions ) {

    const options = optionize<VectorCheckboxOptions, SelfOptions, VectorAdditionCheckboxOptions>()( {

      // SelfOptions
      vectorFill: Color.WHITE,
      vectorStroke: Color.BLACK
    }, providedOptions );

    const symbolNode = new ArrowOverSymbolNode( symbolProperty, {
      maxWidth: 95 // determined empirically
    } );

    const icon = VectorAdditionIconFactory.createVectorIcon( 35, {
      fill: options.vectorFill,
      stroke: options.vectorStroke
    } );

    const content = new HBox( {
      spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
      children: [ symbolNode, icon ]
    } );

    super( vectorVisibleProperty, content, options );
  }
}

vectorAddition.register( 'VectorCheckbox', VectorCheckbox );