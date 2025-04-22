// Copyright 2019-2025, University of Colorado Boulder

/**
 * SumCheckbox is the checkbox labeled 'Sum', used to control visibility of a sum vector.
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionCheckbox, { VectorAdditionCheckboxOptions } from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  vectorIconFill: TColor;
  vectorIconStroke: TColor;
};

type SumCheckboxOptions = SelfOptions & PickRequired<VectorAdditionCheckboxOptions, 'tandem'>;

export default class SumCheckbox extends VectorAdditionCheckbox {

  public constructor( sumVisibleProperty: Property<boolean>, providedOptions: SumCheckboxOptions ) {

    const options = providedOptions;

    const textNode = new Text( VectorAdditionStrings.sumStringProperty, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 75 // determined empirically
    } );

    const icon = VectorAdditionIconFactory.createVectorIcon( 35, {
      fill: options.vectorIconFill,
      stroke: options.vectorIconStroke
    } );

    const content = new HBox( {
      spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
      children: [ textNode, icon ]
    } );

    super( sumVisibleProperty, content, options );
  }
}

vectorAddition.register( 'SumCheckbox', SumCheckbox );