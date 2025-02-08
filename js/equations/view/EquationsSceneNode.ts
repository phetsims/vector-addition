// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsSceneNode is a SceneNode that is specific to the 'Equations' screen.
 *
 * 'Is A' relationship with SceneNode but adds:
 *  - a RectangularRadioButtonGroup for EquationTypes
 *  - a Coefficient Selector Panel for each member of EquationTypes
 *  - a BaseVectorAccordionBox
 *  - 'register' Vectors and add their BaseVectors and components
 *  - Disables the Eraser button
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import ComponentVectorStyles from '../../common/model/ComponentVectorStyles.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import SceneNode, { SceneNodeOptions } from '../../common/view/SceneNode.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsGraph from '../model/EquationsGraph.js';
import BaseVectorsAccordionBox from './BaseVectorsAccordionBox.js';
import EquationsViewProperties from './EquationsViewProperties.js';
import EquationToggleBox from './EquationToggleBox.js';

type SelfOptions = EmptySelfOptions;
type EquationsSceneNodeOptions = SelfOptions & SceneNodeOptions;

export default class EquationsSceneNode extends SceneNode {

  public constructor( graph: EquationsGraph,
                      viewProperties: EquationsViewProperties,
                      componentStyleProperty: EnumerationProperty<ComponentVectorStyles>,
                      graphControlPanelBottom: number,
                      equationButtonsAlignGroup: AlignGroup, // used to make all equation radio buttons the same size
                      equationsAlignGroup: AlignGroup, // used to make all interactive equations the same size
                      providedOptions?: EquationsSceneNodeOptions ) {

    const options = optionize<EquationsSceneNodeOptions, SelfOptions, SceneNodeOptions>()( {

      // SceneNodeOptions
      includeEraser: false
    }, providedOptions );

    super( graph, viewProperties, componentStyleProperty, options );

    // Relocate the 'Vector Values' toggle box so that we have room for the 'Equation' toggle box
    this.vectorValuesToggleBox.top = VectorAdditionConstants.SCREEN_VIEW_BOUNDS.minY + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

    // Add the 'Equation' toggle box
    const equationToggleBox = new EquationToggleBox( graph.vectorSet, graph.equationTypeProperty,
      equationButtonsAlignGroup, equationsAlignGroup, {
        expandedProperty: viewProperties.equationExpandedProperty,
        centerX: graph.graphViewBounds.centerX,
        top: this.vectorValuesToggleBox.bottom + 10
      } );
    this.addChild( equationToggleBox );
    equationToggleBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

    // Add the 'Base Vector' accordion box
    const baseVectorsAccordionBox = new BaseVectorsAccordionBox( viewProperties.baseVectorsVisibleProperty,
      graph.coordinateSnapMode,
      graph.vectorSet, {
        expandedProperty: viewProperties.baseVectorsExpandedProperty,
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: graphControlPanelBottom + 8
      } );
    this.addChild( baseVectorsAccordionBox );
    baseVectorsAccordionBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

    // Add vectors and their base vectors.
    graph.vectorSet.equationsVectors.forEach( vector => {
      this.registerVector( vector, graph.vectorSet );
      this.addBaseVector( graph.vectorSet, vector.baseVector, viewProperties.baseVectorsVisibleProperty );
    } );
  }
}

vectorAddition.register( 'EquationsSceneNode', EquationsSceneNode );