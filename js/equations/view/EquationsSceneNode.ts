// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsSceneNode is a SceneNode that is specific to the 'Equations' screen.
 *
 * 'Is A' relationship with SceneNode but adds:
 *  - a RectangularRadioButtonGroup for EquationType
 *  - a Coefficient Selector Panel for each member of EquationType
 *  - a BaseVectorAccordionBox
 *  - 'register' Vectors and add their BaseVectors and components
 *  - Disables the Eraser button
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import SceneNode, { SceneNodeOptions } from '../../common/view/SceneNode.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsGraph from '../model/EquationsGraph.js';
import BaseVectorsAccordionBox from './BaseVectorsAccordionBox.js';
import EquationsViewProperties from './EquationsViewProperties.js';
import EquationAccordionBox from './EquationAccordionBox.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';

type SelfOptions = EmptySelfOptions;
type EquationsSceneNodeOptions = SelfOptions & SceneNodeOptions;

export default class EquationsSceneNode extends SceneNode {

  // Public for pdomOrder at ScreenView level.
  public readonly equationAccordionBox: Node;
  public readonly baseVectorsAccordionBox: Node;

  public constructor( graph: EquationsGraph,
                      viewProperties: EquationsViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      graphControlPanelBottom: number,
                      equationButtonsAlignGroup: AlignGroup, // used to make all equation radio buttons the same size
                      equationsAlignGroup: AlignGroup, // used to make all interactive equations the same size
                      providedOptions: EquationsSceneNodeOptions ) {

    const options = optionize<EquationsSceneNodeOptions, SelfOptions, SceneNodeOptions>()( {

      // SceneNodeOptions
      includeEraser: false
    }, providedOptions );

    super( graph, viewProperties, componentVectorStyleProperty, options );

    // Relocate the 'Vector Values' accordion box so that we have room for the 'Equation' accordion box
    this.vectorValuesAccordionBox.top = VectorAdditionConstants.SCREEN_VIEW_BOUNDS.minY + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

    // Add the 'Equation' accordion box
    const equationAccordionBox = new EquationAccordionBox( graph.vectorSet, graph.equationTypeProperty,
      equationButtonsAlignGroup, equationsAlignGroup, {
        expandedProperty: viewProperties.equationAccordionBoxExpandedProperty,
        centerX: graph.viewBounds.centerX,
        top: this.vectorValuesAccordionBox.bottom + 10,
        tandem: options.tandem.createTandem( 'equationAccordionBox' )
      } );
    this.addChild( equationAccordionBox );
    equationAccordionBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

    // Add the 'Base Vector' accordion box
    const baseVectorsAccordionBox = new BaseVectorsAccordionBox( viewProperties.baseVectorsVisibleProperty,
      graph.coordinateSnapMode,
      graph.vectorSet, {
        expandedProperty: viewProperties.baseVectorsAccordionBoxExpandedProperty,
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: graphControlPanelBottom + 8,
        tandem: options.tandem.createTandem( 'baseVectorsAccordionBox' )
      } );
    this.addChild( baseVectorsAccordionBox );
    baseVectorsAccordionBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

    // Add vectors and their base vectors.
    graph.vectorSet.equationsVectors.forEach( vector => {
      this.registerVector( vector, graph.vectorSet );
      this.addBaseVector( graph.vectorSet, vector.baseVector, viewProperties.baseVectorsVisibleProperty );
    } );

    this.equationAccordionBox = equationAccordionBox;
    this.baseVectorsAccordionBox = baseVectorsAccordionBox;
  }
}

vectorAddition.register( 'EquationsSceneNode', EquationsSceneNode );