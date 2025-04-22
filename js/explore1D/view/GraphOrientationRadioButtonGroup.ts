// Copyright 2019-2025, University of Colorado Boulder

/**
 * Radio button group for switching between the Vertical and Horizontal graph.
 *
 * @author Brandon Li
 */

import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { GraphOrientation } from '../../common/model/GraphOrientation.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

type SelfOptions = EmptySelfOptions;

type GraphOrientationRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class GraphOrientationRadioButtonGroup extends RectangularRadioButtonGroup<GraphOrientation> {

  public constructor( graphOrientationProperty: StringUnionProperty<GraphOrientation>,
                      providedOptions: GraphOrientationRadioButtonGroupOptions ) {

    const options = optionize4<GraphOrientationRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
        isDisposable: false
      }, providedOptions );

    // Create the description of the buttons
    const items: RectangularRadioButtonGroupItem<GraphOrientation>[] = [
      {
        value: 'horizontal',
        createNode: () => VectorAdditionIconFactory.createGraphOrientationIcon( 'horizontal' ),
        tandemName: 'horizontalRadioButton'
      },
      {
        value: 'vertical',
        createNode: () => VectorAdditionIconFactory.createGraphOrientationIcon( 'vertical' ),
        tandemName: 'verticalRadioButton'
      }
    ];

    super( graphOrientationProperty, items, options );
  }
}

vectorAddition.register( 'GraphOrientationRadioButtonGroup', GraphOrientationRadioButtonGroup );