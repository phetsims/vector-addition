// Copyright 2019-2025, University of Colorado Boulder

/**
 * ComponentVectorStyleControl is the control for selecting how to visually represent component vectors.
 * It consists of a labeled group of radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Brandon Li
 */

import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentVectorStyleRadioButtonGroup from './ComponentVectorStyleRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

const MAX_WIDTH = VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH;

export default class ComponentVectorStyleControl extends VBox {

  public constructor( componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>, tandem: Tandem ) {

    // 'Components' label, left aligned
    const componentsText = new Text( VectorAdditionStrings.componentsStringProperty, {
      font: VectorAdditionConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      layoutOptions: {
        align: 'left'
      }
    } );

    // Radio buttons
    const radioButtonGroup = new ComponentVectorStyleRadioButtonGroup( componentVectorStyleProperty,
      tandem.createTandem( 'radioButtonGroup' ) );

    // Some trickery to get the dynamic layout of radioButtonGroup to behave as desired, and do the right thing
    // for the corner case where all buttons are hidden. See https://github.com/phetsims/vector-addition/issues/299.
    const radioButtonsAlignBox = new AlignBox( radioButtonGroup );
    radioButtonGroup.localBoundsProperty.link( localBounds => {
      const height = localBounds.isFinite() ? localBounds.height : 0;
      radioButtonsAlignBox.setAlignBounds( new Bounds2( 0, 0, MAX_WIDTH, height ) );
    } );

    super( {

      // VBoxOptions
      isDisposable: false,
      children: [ componentsText, radioButtonsAlignBox ],
      align: 'center',
      spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING,
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'ComponentVectorStyleControl', ComponentVectorStyleControl );