// Copyright 2019-2025, University of Colorado Boulder

/**
 * ComponentVectorStyleControl is the control for selecting how to visually represent component vectors.
 * It consists of a labeled group of radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Brandon Li
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import ComponentVectorStyle from '../model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentVectorStyleRadioButtonGroup from './ComponentVectorStyleRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const MAX_WIDTH = VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH;

export default class ComponentVectorStyleControl extends VBox {

  public constructor( componentStyleProperty: EnumerationProperty<ComponentVectorStyle>, tandem: Tandem ) {

    const children: Node[] = [];

    // 'Components' label, left justified
    const componentsText = new Text( VectorAdditionStrings.componentsStringProperty, {
      font: VectorAdditionConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );
    children.push( componentsText );

    // Radio buttons, centered in maxWidth by using an AlignBox
    const radioButtonGroup = new ComponentVectorStyleRadioButtonGroup( componentStyleProperty,
      tandem.createTandem( 'radioButtonGroup' ) );
    children.push( new AlignBox( radioButtonGroup, {
      alignBounds: new Bounds2( 0, 0, MAX_WIDTH, radioButtonGroup.height )
    } ) );

    super( {

      // VBoxOptions
      children: children,
      align: 'left',
      spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING,
      isDisposable: false,
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'ComponentVectorStyleControl', ComponentVectorStyleControl );