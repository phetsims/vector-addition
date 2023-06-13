// Copyright 2019-2023, University of Colorado Boulder

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

import merge from '../../../../phet-core/js/merge.js';
import { AlignGroup } from '../../../../scenery/js/imports.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import SceneNode from '../../common/view/SceneNode.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsGraph from '../model/EquationsGraph.js';
import BaseVectorsAccordionBox from './BaseVectorsAccordionBox.js';
import EquationsViewProperties from './EquationsViewProperties.js';
import EquationToggleBox from './EquationToggleBox.js';

export default class EquationsSceneNode extends SceneNode {

  /**
   * @param {EquationsGraph} graph
   * @param {EquationsViewProperties} viewProperties
   * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
   * @param {number} graphControlPanelBottom
   * @param {AlignGroup} equationButtonsAlignGroup - used to make all equation radio buttons the same size
   * @param {AlignGroup} equationsAlignGroup - used to make all interactive equations the same size
   * @param {Object} [options]
   */
  constructor( graph, viewProperties, componentStyleProperty, graphControlPanelBottom,
               equationButtonsAlignGroup, equationsAlignGroup, options ) {

    assert && assert( graph instanceof EquationsGraph, `invalid graph: ${graph}` );
    assert && assert( viewProperties instanceof EquationsViewProperties, `invalid viewProperties: ${viewProperties}` );
    assert && assert( equationButtonsAlignGroup instanceof AlignGroup, `invalid equationButtonsAlignGroup: ${equationButtonsAlignGroup}` );
    assert && assert( equationsAlignGroup instanceof AlignGroup, `invalid equationsAlignGroup: ${equationsAlignGroup}` );

    options = merge( {

      // super-class options
      includeEraser: false

    }, options );

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
    graph.vectorSet.vectors.forEach( vector => {
      this.registerVector( vector, graph.vectorSet );
      this.addBaseVector( graph.vectorSet, vector.baseVector, viewProperties.baseVectorsVisibleProperty );
    } );
  }
}

vectorAddition.register( 'EquationsSceneNode', EquationsSceneNode );